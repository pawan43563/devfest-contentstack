# ContentSpock

ContentSpock harnesses advanced AI to transform the support experience by automatically identifying user issues and providing actionable solutions within the chatbot. It goes beyond simply resolving problems by categorizing tickets, prioritizing them based on urgency, and routing them to the right teams, all in real time.

## How to setup the project

  
1. #### Clone the repo

         git clone https://github.com/pawan43563/devfest-contentstack.git 

***

2. #### Set-Up the backend server
   

    i. Navigate to the backend folder and run the following commands:

         cd contentstack-backend 

    ii. Install the dependencies:

         npm install 

    iii. Create a .env file and add the following environment variables:

        
         OPENAI_API_KEY=<<YOUR OPENAI API KEY>>
         NODE_ENV=<<YOUR NODE ENVIRONMENT>>
         JIRA_API_BASE_URL=<<YOUR JIRA API BASE URL>>
         JIRA_API_EMAIL=<<YOUR JIRA API EMAIL>>
         JIRA_API_TOKEN=<<YOUR JIRA API TOKEN>>
        

    iv. Build and start the server with following commands:

         npm run build
   
         npm run start

    v. The server will start running on port 3000

***

3. #### Set-Up the frontend

    i. Navigate to the frontend folder and run the following commands:

         cd contentstack-frontend

    ii. Install the dependencies:

         npm install

    iii. Run the following command to create frontend build:

         npm run build

    After the build is completed, dist folder will be craeted inside the contentspock-frontend directory.

    iv. Open Chrome, Goto Extensions > Manage Extensions, Click on Load Unpacked and select the dist folder.

    v. The  "ContentSpock" extension will be loaded inside your chrome extensions list and is ready to use. 

***

4. Click on the "ContentSpock" extension, a chat panel will open. You can start interacting with the ContentSpock.

***

#### Happy Hacking!
