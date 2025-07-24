# SpeakBetter - English Speaking Improvement App

SpeakBetter is an iPhone application designed specifically to enhance English speaking and expression skills. Through intelligent speech analysis and personalized feedback, it helps users improve their English speaking abilities.

## Key Features

### 1. Random Topic Practice
- Provides 30 carefully designed speaking practice topics
- Covers daily life, hobbies, career development, and more
- Supports one-click new topic generation

### 2. Smart Recording Functionality
- High-quality audio recording
- Real-time recording duration display
- Visual feedback for recording status

### 3. Speech Recognition & Transcription
- Uses Apple Speech Framework for speech recognition
- Real-time text transcription generation
- Supports English speech recognition

### 4. Intelligent Analysis Features
- **Filler Word Detection**: Automatically identifies and marks common filler words (such as "um", "uh", "like", etc.)
- **Vocabulary Repetition Analysis**: Detects overused words and provides improvement suggestions
- **Sentence Structure Analysis**: Evaluates sentence diversity and provides improvement suggestions

### 5. Audio Playback with Synchronized Highlighting
- Audio playback controls (play/pause/progress bar)
- Text synchronized with audio highlighting
- Precise word timestamp matching

### 6. Data Persistence
- Uses Core Data for local data storage
- Saves recording sessions, transcription text, and analysis results
- Supports history record viewing and management

### 7. History Record Management
- View all recording history
- Detailed recording information display
- Support for deleting history records

## Technical Architecture

### Core Technology Stack
- **SwiftUI** - Modern UI framework
- **Core Data** - Data persistence
- **AVFoundation** - Audio recording and playback
- **Speech Framework** - Speech recognition
- **Combine** - Reactive programming

### Project Structure
```
SpeakBetter/
├── SpeakBetterApp.swift          # App entry point
├── ContentView.swift             # Main view container
├── RecordingView.swift           # Recording interface
├── AnalysisView.swift            # Analysis results interface
├── PlaybackView.swift            # Audio playback interface
├── HistoryView.swift             # History records interface
├── AudioRecorder.swift           # Audio recording management
├── SpeechAnalyzer.swift          # Speech analysis engine
├── PromptGenerator.swift         # Topic generator
├── CoreDataManager.swift         # Data management
└── SpeakBetter.xcdatamodeld/     # Data model
```

### Data Models
- **RecordingSession**: Recording session entity
- **SpeechAnalysis**: Speech analysis results entity
- **WordTiming**: Word timestamp entity

## Permission Requirements

The app requires the following permissions to function properly:
- **Microphone Permission** - For recording functionality
- **Speech Recognition Permission** - For speech-to-text functionality

## System Requirements

- iOS 17.0 or higher
- iPhone or iPad
- Internet connection required (for speech recognition)

## Installation and Running

1. Open the project with Xcode 15.0 or higher
2. Select target device or simulator
3. Click the run button or press Cmd+R

## Usage Instructions

### Start Recording Practice
1. Open the app and view the randomly generated topic
2. Click "Start Recording" to begin recording
3. Practice English speaking based on the topic
4. Click "Stop Recording" to end the recording

### View Analysis Results
1. After recording, the system automatically performs speech analysis
2. View the transcription text and detected filler words
3. Read improvement suggestions
4. Click the "Play" button to listen to the recording and view synchronized highlighting

### Manage History Records
1. Switch to the "History" tab
2. View all saved recording records
3. Click on any record to view detailed information
4. Swipe left to delete unwanted records

## Future Feature Plans

### AI Pronunciation Guidance
- Integrate AI speech synthesis technology
- Provide standard pronunciation examples
- Pronunciation comparison analysis

### Personalized Learning Plans
- Create learning plans based on user performance
- Progress tracking and achievement system
- Personalized practice suggestions

### Social Features
- Share recordings with friends or teachers
- Online speaking practice partner matching
- Community discussions and feedback

### Advanced Analysis Features
- Intonation analysis
- Speaking speed evaluation
- Grammar error detection
- Vocabulary richness analysis

## Development Team

This is an open-source project. Contributions and suggestions are welcome.

## License

This project is licensed under the MIT License. See the LICENSE file for details. 