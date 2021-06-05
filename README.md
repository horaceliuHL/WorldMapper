# World Mapper

The World Mapper allows for account creation, deletion, and update capabilities. It further allows users to add maps, regions, and subregions to list out region names, leaders, capitals, flags, and landmarks. These regions can be sorted, and there are arrow key capabilities for moving around when editing and undoing and redoing the edits. Users can also navigate between parent regions and subregions easily. When viewing the landmarks of a region, users can also add, update, and delete landmarks (with redo and undo capabilities), while being able to view all subregion landmarks as well. A user can also change the parent region of the current region to another parent region.


<table>
      <tr>
        <td><img src = "https://user-images.githubusercontent.com/65971326/120876778-daaa1f00-c580-11eb-8a3d-547725b7e834.png"></td>
        <td><img src = "https://user-images.githubusercontent.com/65971326/120876782-dc73e280-c580-11eb-9b18-797739317fec.png"></td>
       </tr> 
       <tr>
        <td><img src = "https://user-images.githubusercontent.com/65971326/120876777-da118880-c580-11eb-9769-3789436f8745.png"></td>
        <td><img src = "https://user-images.githubusercontent.com/65971326/120876779-daaa1f00-c580-11eb-9086-01676f0d7b22.png"></td>
       </tr>
</table>


Technologies used: React, Express, Node, Apollo Server, GraphQL, MongoDB

The env file has been removed. To allow it to run, add a .env file in the root directory, paste this in, and change accordingly.

```
REFRESH_TOKEN_SECRET = '<Random Token>'
ACCESS_TOKEN_SECRET = '<Random Token>'

MONGO_URI = "mongodb+srv://<Username>:<Password>@cluster0.bymh4.mongodb.net/<DBName>?retryWrites=true&w=majority"
FRONTEND_PORT = 8080
BACKEND_PORT = 4000
CLIENT_LOCAL_ORIGIN = 'http://localhost:8080'
SERVER_LOCAL_DOMAIN = 'http://localhost'

BROWSER=firefox
```

To run properly: 

```
$ cd client
$ npm install
$ cd ..
$ npm install
$ npm start
```
