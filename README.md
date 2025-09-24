# Illini Swap Codebase Overview & Guide

Welcome to the Illini Swap codebase! This guide provides a comprehensive overview of the project, including its structure, main files, and how you can get started as a new contributor.

---

## 📦 Project Structure

```
illini-swap/
│
├── App.js
├── index.js
├── firebaseConfig.js
├── metro.config.js
│
├── HomeScreen.js
├── SignUpScreen.js
├── PreferenceScreen.js
├── OfferDetailScreen.js
├── AvailabilityScreen.js
├── OffersContext.js
│
├── android/
│   └── app/src/main/java/com/oshah/illiniswap/
│       ├── MainActivity.kt
│       └── MainApplication.kt
│
├── ios/
│   └── illiniswap/
│       ├── AppDelegate.mm
│       └── main.m
│       └── Podfile
│
└── README.md
```

---

## 🗂️ Key Files & Their Roles

### Top-Level Files

- **App.js**: The entry point for the React Native application. Sets up navigation and context providers for Offers, Favorites, etc. All screens are registered here.
- **index.js**: Registers the root component (`App`) with Expo, ensuring proper setup for both Expo Go and native builds.
- **firebaseConfig.js**: Initializes Firebase services (Auth, Firestore) using your project credentials. Handles persistent authentication and database access.
- **metro.config.js**: Customizes Metro bundler config for Expo/React Native, e.g., adding `.cjs` extensions.

### Main Screens

- **HomeScreen.js**: The main dashboard after login. Displays listings, categories (Clothing, Books, Tech, Misc), and environmental facts. Handles product grid rendering.
- **SignUpScreen.js**: User registration logic. Enforces `@illinois.edu` email, creates Firebase Auth user, writes user profile to Firestore, and routes to preferences.
- **PreferenceScreen.js**: Lets users select their preferred categories (Clothes, Books, Tech, etc.), updates preferences in Firestore.
- **OfferDetailScreen.js**: Shows details for an offer/listing (images, title, description, time selection).
- **AvailabilityScreen.js**: Lets users choose their available dates for exchanges using a 2-week calendar grid.

### Context Providers

- **OffersContext.js**: Implements React context for managing offer/listing state globally.

### Platform-Specific Files

#### Android
- **MainActivity.kt**: Entry point for the Android app. Sets up the theme, links the main React Native component, and enables gesture handling.
- **MainApplication.kt**: Configures React Native host, developer support, Hermes engine, and lifecycle events.

#### iOS
- **AppDelegate.mm**: Sets up the main React Native module, links the JS bundle, and handles linking APIs.
- **main.m**: iOS app entry point.
- **Podfile**: CocoaPods configuration for installing native modules required by Expo and React Native.

---

## ⚙️ How It Works

- The app is built with **React Native** and **Expo**, allowing cross-platform deployment (iOS and Android).
- User authentication and data storage are powered by **Firebase Auth** and **Firestore**.
- Screens are managed using React Navigation and wrapped in context providers for shared state (offers, favorites).
- Android and iOS folders contain platform-specific native code and configuration.

---

## 🚀 Getting Started

1. **Install Dependencies**  
   Run `npm install` or `yarn` in the root directory.

2. **Configure Firebase**  
   Check that `firebaseConfig.js` contains valid credentials. (Already set up in repo.)

3. **Run the App**  
   - For Expo: `npx expo start`  
   - For Android/iOS native: Build using `android/` or `ios/` folders respectively.

4. **Explore Screens**  
   - Start with `App.js` to see navigation flow.
   - Review individual screen files for UI and logic.
   - Check context files for global state management.

5. **Platform Setup**  
   - For Android changes, look at `android/app/src/main/java/com/oshah/illiniswap/`.
   - For iOS, see `ios/illiniswap/`.

---

## 📝 Contribution Tips

- Add new screens by registering them in `App.js` and creating the relevant JS file.
- Use `OffersContext.js` for new global state needs.
- Follow patterns in existing screens for UI and navigation.
- For native code, refer to Android/iOS folders for setup.

---

## 📚 Additional Notes

- The codebase is mostly in JavaScript, with some Kotlin (Android), Objective-C/++ (iOS), and Ruby (iOS Pods).
- All user logic, authentication, and listings are managed using Firebase.
- Environmental impact and sustainability are core themes reflected in UI content.

---

Happy hacking! If you have questions, check the screen files for inline documentation, or reach out to project maintainers.
