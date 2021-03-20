<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://fontmeme.com/permalink/210320/c38112f2aab8c423e67f009a7a09a42b.png" >
  </a>

  <h3 align="center">SOS Assistance Platform</h3>

</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![alt text](https://github.com/Pro-Abhinav/Sahayak/blob/master/public/assets/img/landingPage.png)

Our platform enables users to volunteer and help nearby users in need of any emergency assistance or aid. Through the website, users can send SOS request to other users in  the radius of 2km. Once the SOS request is sent, the nearby users receive the request and they have the choice to either accept the request or reject it depending their personal situation

How it is different from others? 
Our app will be sending SOS messages not only to nearest police/medical stations, assigned relatives but also to the local people who live near the victim’s house.
All the people registered on the app will be verified with some kind of official documentation (aadhaar card/PAN etc.). This verification is done to remove the possibility of misuse of the application by some random person. All the requests made and requests answered will be stored in a log.
How sending messages to people living near the victims house will help? 
Sending messages to the local people will be beneficial as they can offer help much faster than police/ambulances.
e.g. If someone crashed his car on highway, locals can help promptly than police/ambulance.

## Technology used:
* Frontend
    * HTML
    * CSS
    * JavaScript
    * jQuery
    * Bootstrap v4.5
* Backend
    * Node
    * Express
* Database
    * MongoDB


<!-- GETTING STARTED -->
## Getting Started
### Prerequisites

* NodeJS
* NPM
* MongoDB
* Text Editor. eg: Visual Code Studio
* CLI Tool

### Installation

1. Get a Google Maps API key. 
> Two API keys are being used 
> - Maps Javascript API
> - Geocoding API

2. Clone the repo
   ```sh
   git clone https://github.com/Pro-Abhinav/Sahayak.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in '.env'
   ```dotenv
    GOOGLE_MAPS_API_KEY = "ENTER YOUR API"
   ```
5. Enter other secrets in '.env' file.
    ```dotenv
    PASSPORT_SECRET = "YOUR SECRET"
    ADMIN_SECRET_CODE = "YOUR ADMIN PASSWORD"
    APP_LISTEN_PORT = 3000
    MONGO_URL = "DATABASE LINK"
    ```



<!-- USAGE EXAMPLES -->
## Usage

Our platform enables users to volunteer and help nearby users in need of any emergency assistance or aid. Through the website, users can send SOS request to other users in the radius of 2km. Once the SOS request is sent, the nearby users (within 2km) receive the request and they have the choice to either accept the request or reject it depending their personal situation.<br>
Through this, the requester can get immediate assistance through nearby volunteers.
Through the google maps api provided on the platform the volunteer will be able to get the address of the requester.
Even the requester will be able to view his/her location on the google maps before sending the request 



<!-- LICENSE -->
## License

Distributed under the MIT License.



<!-- CONTACT -->
## Contact

- Abhinav Tripathi - abhi3pathi01@gmail.com
- Anmol Sahu - anmolsahu2k@gmail.com

Project Link: [https://github.com/Pro-Abhinav/Sahayak](https://github.com/Pro-Abhinav/Sahayak)



