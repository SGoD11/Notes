# Notes
This is just a revision or a quick recap after several days of learning my ejs and other api db concepts


## Starting from Begining

### Pre Requirement
- PostgreSQL Installed (`pgadmin` may be good to look up data other than only using the `shell`)
- Nodejs
- VScode

## Installing Packages
`git clone` the repo

`cd ` into the repo

First of all ensure that all packages are installed by running
```npm i```


## PostgreSQL

Okay now time to gear up and open postgreSQL(shell) or pgAdmin and have a 
- `database` with name as `NotePad`
- A `Table` with name as `NoteePad` <small>(I myself don't know why I have named it like this) </small>
- And the `table` shall have headings as
    - id
    - heading
    - title
    - date

<big>Open `server.js` and modify the `password` </big>

## Starting with terminal
Then make sure you have 2 terminals open one is for `localhost:3000` which is nothing but the backend of our website that will handle all the `routes` and `form data`
and another for the `api` which will pass the data from the data or insert the data which is like `localhost:4000`

#### Now in the terminal run this two commands
<table>
<caption> Terminal Commands </caption>
<tr>
<th> 1st Terminal </th>
<th> 2nd Terminal </th>
</tr>
<tr>
<td> npm run server </td>
<td> npm run start </td>
</tr>
</table>

<big>Now everything will work as expected </big>

## Tailwind Config ( for mod the current look)
First open one extra terminal

<small>There's a tailwind command too if you want to mod the look just `npm run tailwind` </small>
This will basically ensure that when you change the style it will make a change in the `output.css` file because I am using postcss