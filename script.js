class BasketButler {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // New User flow
        const newUserSend = document.getElementById('new-user-send');
        const newUserInput = document.getElementById('new-user-input');
        if (newUserSend && newUserInput) {
            newUserSend.addEventListener('click', () => this.handleSend('new-user', 'message'));
            newUserInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend('new-user', 'message');
                }
            });
        }

        // Returning User flow
        const returningUserSend = document.getElementById('returning-user-send');
        const returningUserInput = document.getElementById('returning-user-input');
        if (returningUserSend && returningUserInput) {
            returningUserSend.addEventListener('click', () => this.handleSend('returning-user', 'message'));
            returningUserInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend('returning-user', 'message');
                }
            });
        }

        // Paste Link flow
        const pasteLinkSend = document.getElementById('paste-link-send');
        const pasteLinkInput = document.getElementById('paste-link-input');
        if (pasteLinkSend && pasteLinkInput) {
            pasteLinkSend.addEventListener('click', () => this.handleSend('paste-link', 'link'));
            pasteLinkInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend('paste-link', 'link');
                }
            });
        }
    }

    async handleSend(flow, inputType) {
        const inputElement = document.getElementById(`${flow}-input`);
        const inputText = inputElement.value.trim();
        
        if (!inputText) {
            inputElement.focus();
            return;
        }

        this.setLoading(flow, true);
        
        try {
            const response = await this.callAgentAPI(inputText, inputType, flow);
            this.displayResponse(response, flow);
        } catch (error) {
            this.displayError(error, flow);
        } finally {
            this.setLoading(flow, false);
        }
    }

    async callAgentAPI(input, type, flow) {
        const payload = {
            input: input,
            type: type,
            flow: flow,
            sessionId: 'basketbutler-session-002',
            timestamp: new Date().toISOString()
        };

        const API_ENDPOINT = 'https://215ewwwplk.execute-api.us-east-1.amazonaws.com/dev/AgentCallerJS';
        
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('CORS Error: The API endpoint may not allow requests from this domain. Please check CORS settings on your AWS Gateway API.');
            }
            throw error;
        }
    }

    displayResponse(response, flow) {
        const responseSection = document.getElementById(`${flow}-response`);
        const responseContent = document.getElementById(`${flow}-content`);
        
        responseSection.style.display = 'block';
        
        let content = response.message || response.response || 'Response received successfully.';
        
        if (response.suggestions && response.suggestions.length > 0) {
            content += '\n\n🍽️ Meal Suggestions:\n';
            response.suggestions.forEach((suggestion, index) => {
                content += `${index + 1}. ${suggestion}\n`;
            });
        }
        
        if (response.groceryItems && response.groceryItems.length > 0) {
            content += '\n🛒 Grocery List:\n';
            response.groceryItems.forEach(item => {
                content += `• ${item}\n`;
            });
        }
        
        // 新增顶部提示，并用气泡包裹
        const tip = '<div style="font-size:15px;color:#00754a;margin-bottom:8px;font-weight:500;">I have already updated the recipes and products, and I will remember your preference.</div>';
        responseContent.innerHTML = `<div class="butler-bubble">${tip}<pre style="background:none;border:none;padding:0;margin:0;font-family:inherit;white-space:pre-wrap;">${content}</pre></div>`;
        responseContent.scrollIntoView({ behavior: 'smooth' });
    }

    displayError(error, flow) {
        const responseSection = document.getElementById(`${flow}-response`);
        const responseContent = document.getElementById(`${flow}-content`);
        
        responseSection.style.display = 'block';
        responseContent.textContent = `Sorry, I encountered an error: ${error.message}\n\nPlease try again or check your API configuration.`;
        responseContent.style.background = '#fdf2f2';
    }

    setLoading(flow, isLoading) {
        const sendButton = document.getElementById(`${flow}-send`);
        const inputElement = document.getElementById(`${flow}-input`);
        const responseSection = document.getElementById(`${flow}-response`);
        const responseContent = document.getElementById(`${flow}-content`);
        
        sendButton.disabled = isLoading;
        inputElement.disabled = isLoading;
        
        if (isLoading) {
            const buttonTexts = {
                'new-user': 'Getting Started...',
                'returning-user': 'Planning...',
                'paste-link': 'Analyzing...'
            };
            
            sendButton.textContent = buttonTexts[flow] || 'Sending...';
            responseSection.style.display = 'block';
            responseContent.innerHTML = '<span class="loading">🤖 BasketButler is thinking...</span>';
            responseContent.style.background = '#f8f8f8';
        } else {
            const buttonTexts = {
                'new-user': 'Get Started',
                'returning-user': 'Let\'s Plan',
                'paste-link': 'Analyze Link'
            };
            
            sendButton.textContent = buttonTexts[flow] || 'Send';
            inputElement.disabled = false;
            inputElement.value = '';
            inputElement.focus();
        }
    }
}

function switchInputMode(toggle, page) {
    const textarea = document.getElementById(`${page}-input`);
    const button = document.getElementById(`${page}-send`);
    if (!toggle.checked) {
        // Text mode
        if (page === 'new-user') {
            textarea.placeholder = 'Tell me about your dietary preferences, allergies, favorite cuisines, or any specific needs...';
            button.textContent = 'Submit';
        } else if (page === 'returning-user') {
            textarea.placeholder = "What's on your mind? Need meal ideas, want to update your grocery list, or plan for a special occasion?";
            button.textContent = 'Submit';
        } else if (page === 'paste-link') {
            textarea.placeholder = 'Paste any text here...';
            button.textContent = 'Submit';
        }
    } else {
        // Link mode
        textarea.placeholder = 'Paste a recipe URL, food blog link, social media post, or any food-related link here...';
        button.textContent = 'Analyze Link';
    }
}

function showReason(id) {
    // 先隐藏所有 recommend-reason
    document.querySelectorAll('.recommend-reason').forEach(function(el) {
        el.style.display = 'none';
    });
    // 再显示当前 id
    var el = document.getElementById(id);
    if (el) {
        el.style.display = 'block';
    }
}

// Example data
const groceryDataNewUser = [
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/81LKLCmdAQL.AC_SL240_.jpg',
    price: '$1.25',
    unit: '($0.20/ounce)',
    title: 'Medium Hass Avocado',
    meta: '8 Ounce',
    qty: 0
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/41hHF0IiidL.AC_SL240_.jpg',
    price: '$25.99',
    unit: '($3.25/ounce)',
    title: 'Navitas Organics Pomegranate Powder',
    meta: '8 Ounce',
    qty: 0
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/71B9p9DbUwL.AC_SL240_.jpg',
    price: '$12.49',
    unit: '($0.69/count)',
    title: 'Vital Farms 18 Pasture-Raised Eggs, Large, Brown',
    meta: '18 Count',
    qty: 0
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/81LKLCmdAQL.AC_SL240_.jpg',
    price: '$1.25',
    unit: '($0.20/ounce)',
    title: 'Medium Hass Avocado',
    meta: '8 Ounce',
    qty: 0
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/41hHF0IiidL.AC_SL240_.jpg',
    price: '$25.99',
    unit: '($3.25/ounce)',
    title: 'Navitas Organics Pomegranate Powder',
    meta: '8 Ounce',
    qty: 0
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/71B9p9DbUwL.AC_SL240_.jpg',
    price: '$12.49',
    unit: '($0.69/count)',
    title: 'Vital Farms 18 Pasture-Raised Eggs, Large, Brown',
    meta: '18 Count',
    qty: 0
  }
];
const groceryDataReturningUser = [
  {
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
    price: '$3.99',
    unit: '/lb',
    title: 'Red Cherries',
    meta: '1 Bag',
    qty: 0
  },
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
    price: '$8.99',
    unit: '/lb',
    title: 'Rainier Cherries',
    meta: '1 Bag',
    qty: 0
  },
  {
    img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=80&h=80',
    price: '$9.49',
    unit: '/lb',
    title: 'Lactalis, Brie De Paris',
    meta: '8 Ounce',
    qty: 0
  }
];
const groceryDataPasteLink = [
  {
    img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=80&h=80',
    price: '$1.69',
    unit: '/lb',
    title: 'Gold Potato',
    meta: '1 Each',
    qty: 0
  },
  {
    img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=80&h=80',
    price: '$25.99',
    unit: '($3.25/ounce)',
    title: 'Navitas Organics Pomegranate Powder',
    meta: '8 Ounce',
    qty: 0
  }
];

function renderGroceryScroll(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data.map((item, idx) => `
    <div class="grocery-card">
      <img src="${item.img}" alt="${item.title}">
      <div class="grocery-info">
        <div class="grocery-price-row">
          <span class="grocery-price">${item.price}</span>
          <span class="grocery-unit">${item.unit}</span>
        </div>
        <div class="grocery-title">${item.title}</div>
        <div class="grocery-meta">${item.meta}</div>
      </div>
      ${item.qty === 0 ?
        `<button class=\"add-cart-btn-round\" onclick=\"changeQty('${containerId}', ${idx}, 1)\"><span>+</span></button>` :
        `<div class=\"cart-qty-control\">
          <button class=\"qty-btn\" onclick=\"changeQty('${containerId}', ${idx}, -1)\">-</button>
          <span class=\"qty-num\">${item.qty}</span>
          <button class=\"qty-btn\" onclick=\"changeQty('${containerId}', ${idx}, 1)\">+</button>
        </div>`
      }
    </div>
  `).join('');
}

function changeQty(containerId, idx, delta) {
  let dataArr;
  if (containerId === 'grocery-scroll-new-user') dataArr = groceryDataNewUser;
  else if (containerId === 'grocery-scroll-returning-user') dataArr = groceryDataReturningUser;
  else if (containerId === 'grocery-scroll-paste-link') dataArr = groceryDataPasteLink;
  else return;
  dataArr[idx].qty = Math.max(0, (dataArr[idx].qty || 0) + delta);
  renderGroceryScroll(containerId, dataArr);
}

// Example recipe data
const recipesDataNewUser = [
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=200',
    label: '',
    title: 'Grilled Salmon Salad',
    time: '20m',
    ingredients: 8,
    fav: false,
    reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Salmon, Avocado</li><li>Dietary preference: Low-carb, High-protein</li><li>Health goal: More Omega-3, Less sodium</li></ul>',
    showReason: false
  },
  {
    img: 'https://m.media-amazon.com/images/S/alexa-kitchen-msa-na-prod/recipes/mealsinminutes/0f84092675a598c729de2fc1453ac8b3f0df9c67bc2a78a5c23c5674a80d7a2f._SX1024_.jpeg',
    label: '',
    title: 'Quinoa Veggie Bowl',
    time: '15m',
    ingredients: 6,
    fav: true,
    reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Quinoa, Broccoli</li><li>Dietary preference: Vegetarian</li><li>Health goal: More fiber, More vitamins</li></ul>',
    showReason: false
  }
];
const recipesDataReturningUser = [
    {
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=200',
        label: '',
        title: 'Grilled Salmon Salad',
        time: '20m',
        ingredients: 8,
        fav: false,
        reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Salmon, Avocado</li><li>Dietary preference: Low-carb, High-protein</li><li>Health goal: More Omega-3, Less sodium</li></ul>',
        showReason: false
      },
      {
        img: 'https://m.media-amazon.com/images/S/alexa-kitchen-msa-na-prod/recipes/mealsinminutes/0f84092675a598c729de2fc1453ac8b3f0df9c67bc2a78a5c23c5674a80d7a2f._SX1024_.jpeg',
        label: '',
        title: 'Quinoa Veggie Bowl',
        time: '15m',
        ingredients: 6,
        fav: true,
        reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Quinoa, Broccoli</li><li>Dietary preference: Vegetarian</li><li>Health goal: More fiber, More vitamins</li></ul>',
        showReason: false
      }
];
const recipesDataPasteLink = [
    {
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=200',
        label: '',
        title: 'Grilled Salmon Salad',
        time: '20m',
        ingredients: 8,
        fav: false,
        reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Salmon, Avocado</li><li>Dietary preference: Low-carb, High-protein</li><li>Health goal: More Omega-3, Less sodium</li></ul>',
        showReason: false
      },
      {
        img: 'https://m.media-amazon.com/images/S/alexa-kitchen-msa-na-prod/recipes/mealsinminutes/0f84092675a598c729de2fc1453ac8b3f0df9c67bc2a78a5c23c5674a80d7a2f._SX1024_.jpeg',
        label: '',
        title: 'Quinoa Veggie Bowl',
        time: '15m',
        ingredients: 6,
        fav: true,
        reason: '<strong>Recommended because:</strong><ul><li>Recently bought: Quinoa, Broccoli</li><li>Dietary preference: Vegetarian</li><li>Health goal: More fiber, More vitamins</li></ul>',
        showReason: false
      }
];

function renderRecipesScroll(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data.map((item, idx) => `
    <div class="recipe-card" id="recipe-card-${containerId}-${idx}">
      <div class="recipe-img-wrap">
        <img class="recipe-img" src="${item.img}" alt="${item.title}">
        <button class="recipe-fav" onclick="toggleRecipeFav('${containerId}', ${idx})">${item.fav ? '❤' : '♡'}</button>
      </div>
      <div class="recipe-content">
        <div class="recipe-title">${item.title}</div>
        <div class="recipe-meta">
          <span class="meta-icon">⏰</span><span>${item.time}</span>
          <span>•</span>
          <span>${item.ingredients} ingredients</span>
        </div>
        <div class="recipe-bottom-row">
          <button class="shop-ingredients-btn" onclick="shopIngredients('${containerId}', ${idx})">Shop ingredients</button>
          <span class="butler-icon-recipe" onclick="toggleRecipeReason('${containerId}', ${idx})">🤵‍♂️</span>
        </div>
      </div>
    </div>
  `).join('');
  // 渲染 reason-bar
  const reasonBar = document.getElementById('reason-bar-' + containerId.replace('recipes-scroll-', ''));
  if (reasonBar) {
    const showIdx = data.findIndex(item => item.showReason);
    if (showIdx !== -1) {
      reasonBar.innerHTML = `<span class='butler-bubble-icon'>🤵‍♂️</span><div class='recommend-reason-bar recommend-reason-bar-with-icon'>${data[showIdx].reason}</div>`;
      reasonBar.style.display = 'flex';
    } else {
      reasonBar.innerHTML = '';
      reasonBar.style.display = 'none';
    }
  }
}

function toggleRecipeFav(containerId, idx) {
  let dataArr;
  if (containerId === 'recipes-scroll-new-user') dataArr = recipesDataNewUser;
  else if (containerId === 'recipes-scroll-returning-user') dataArr = recipesDataReturningUser;
  else if (containerId === 'recipes-scroll-paste-link') dataArr = recipesDataPasteLink;
  else return;
  dataArr[idx].fav = !dataArr[idx].fav;
  renderRecipesScroll(containerId, dataArr);
}

function toggleRecipeReason(containerId, idx) {
  let dataArr;
  if (containerId === 'recipes-scroll-new-user') dataArr = recipesDataNewUser;
  else if (containerId === 'recipes-scroll-returning-user') dataArr = recipesDataReturningUser;
  else if (containerId === 'recipes-scroll-paste-link') dataArr = recipesDataPasteLink;
  else return;
  // 只显示当前卡片的 reason，再次点击则隐藏
  if (dataArr[idx].showReason) {
    dataArr[idx].showReason = false;
  } else {
    dataArr.forEach((item, i) => item.showReason = (i === idx));
  }
  renderRecipesScroll(containerId, dataArr);
}

function shopIngredients(containerId, idx) {
  // 可在此处弹出 grocery-scroll 或跳转
  alert('Show ingredients for: ' + (containerId === 'recipes-scroll-new-user' ? recipesDataNewUser[idx].title : containerId === 'recipes-scroll-returning-user' ? recipesDataReturningUser[idx].title : recipesDataPasteLink[idx].title));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BasketButler();
});

document.addEventListener('DOMContentLoaded', function() {
  renderGroceryScroll('grocery-scroll-new-user', groceryDataNewUser);
  renderGroceryScroll('grocery-scroll-returning-user', groceryDataReturningUser);
  renderGroceryScroll('grocery-scroll-paste-link', groceryDataPasteLink);
  renderRecipesScroll('recipes-scroll-new-user', recipesDataNewUser);
  renderRecipesScroll('recipes-scroll-returning-user', recipesDataReturningUser);
  renderRecipesScroll('recipes-scroll-paste-link', recipesDataPasteLink);
});