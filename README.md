# Injection Tracker

A web application for tracking medication injections, designed specifically for self-administered injectable medications like Infliximab.

## Features

- 🎨 Color themes that change each time you log in
- 📅 Schedule tracking with automatic next injection calculation
- ⏱️ Countdown timer to your next injection
- 📝 Detailed logging of each injection with:
  - Date and time
  - Injection site rotation (Stomach Right/Left, Thigh Right/Left)
  - Medication serial number tracking
  - Side effects recording
  - Additional notes
- 📊 Complete injection history
- 💾 Local storage to keep your data on your device

## How to Use

1. **Log in:** Enter your name when prompted
2. **Set up your schedule:** 
   - Click "Set Up Your Schedule"
   - Enter the date of your first injection
   - The app will calculate all future injections (every 14 days)
3. **Log each injection:**
   - Enter the required information (date, time, site, serial number)
   - Optionally add side effects and notes
   - Click "Save Injection Log"
4. **View your history:**
   - Scroll down to see all past injections

## Privacy

All your data is stored locally on your device using browser localStorage. No information is sent to any server.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage API

## License

This project is open source and available for personal use.

## Credits

Created by DamnrB76
