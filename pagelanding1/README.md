# Subscription Landing Page

This project is a landing page designed for selling subscriptions to various social media applications, including Netflix, Spotify, Vieon, Galaxy, YouTube Premium, and Canva. The landing page aims to provide users with an engaging experience, showcasing the benefits of each subscription service and encouraging sign-ups.

## Project Structure

- **index.html**: The main HTML file that serves as the entry point for the web application.
- **css/styles.css**: Contains styles for the landing page, defining layout, colors, fonts, and other visual elements.
- **js/main.js**: JavaScript code for handling interactivity, animations, and dynamic content.
- **components/**: Contains reusable HTML components for different sections of the landing page:
  - **hero.html**: The hero section featuring a prominent call-to-action.
  - **features.html**: Highlights the benefits of the subscription services.
  - **pricing.html**: Displays pricing information for the various subscription services.
  - **providers.html**: Showcases the different social media apps available for subscription.
  - **testimonials.html**: Contains testimonials from users for social proof.
  - **faq.html**: Frequently asked questions to address common concerns.
- **data/providers.json**: JSON data about the subscription providers, including names, logos, and descriptions.
- **assets/**: Contains assets used in the landing page:
  - **icons/providers/**: Icon images for the various subscription providers.
  - **fonts/**: Custom font files used in the design.
- **scripts/build.sh**: Shell script for building or deploying the project.
- **.gitignore**: Specifies files and directories to be ignored by version control.
- **package.json**: Configuration file for npm, listing dependencies, scripts, and metadata.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   ```
   npm install
   ```
4. Open `index.html` in your web browser to view the landing page.

## Usage

This landing page can be customized by modifying the HTML components, styles, and JavaScript as needed. Update the `providers.json` file to change the subscription providers displayed on the page.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.