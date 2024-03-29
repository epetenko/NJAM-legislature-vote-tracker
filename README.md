# NJAM-legislature-vote-tracker
A sortable tool to give readers a quick glance on where support falls on an issue in the NJ legislature.


### What this is

A DataTables-fed interactive in the style of Carla's lookup tool that gives the position of every NJ legislator on a topic. See an example here: https://www.nj.com/politics/2019/06/how-your-lawmaker-voted-for-state-budget-that-defied-murphys-call-for-millionaires-tax.html. (They're designed to sit side-by-side, but the margin has been slightly cut off.)

### How it works
If you want to use this, the only real thing you have to do code-wise is change the Google Spreadsheet reference. Most of the work happens there, where reporters input official positions into a spreadsheet that already contains legislator's information from the NJ legislature website (more on that later). See an example here: https://docs.google.com/spreadsheets/d/1CrPjbRGhj0bMipCKEMSho09ZEG1GOrOF8-p3vz-Pj-g/edit?usp=sharing

If you want to use this, your first step will be to copy the above spreadsheet FOR BOTH SENATE AND ASSEMBLY. When you're ready to put it into the tool, do two things to the spreadsheet:

- Go to `File > Publish to the web` and publish the whole spreadsheet to the web. It will create a link for you to use. *Don't use it.* It won't work. It just needs to be published for some reason.
- Go to `Share - Link Sharing`, turn link sharing on, and grab the link that says anyone can view. Then copy the code in between the `/d/` and the `/edit?usp=sharing`. That key will go into the code.

The live version of the tool is at `init_budget_votes_0519.js`. Go to 
```
    var public_spreadsheet_url = '1CrPjbRGhj0bMipCKEMSho09ZEG1GOrOF8-p3vz-Pj-g';
```
and change the thing inside the quote marks to your key.

I've also created a "static" version of the tool if you want that for some reason at `init_cham_static.js`. Essentially, you'll have to download both Assembly and Senate spreadsheets as csv and then convert them to JSON, just because DataTables only takes JSON.

If you want to change what the table displays I've tried to comment on what some of the chunks do in init_budget_votes. You should also check out Carla's lookup table tool and the documentation for Tabletop and DataTables for help.

### About that data
You'll notice the tool includes a link to helpfully look up your legislator by town. The state didn't provide that; I had to create it using the state's [legislative roster](https://www.njleg.state.nj.us/downloads.asp) and some creative scraping. You'll have to go back to that roster to update the legislator info for this tool and the town lookup when there's an election. Fun fun fun!

Because I love you, future data journo, I will link you to the [spreadsheet I used to create the lookup](https://docs.google.com/spreadsheets/d/1qPs-snlea4W_OKcNRDtDpXUZqztZpMG6ZcN2z2I44X4/edit?usp=sharing). Simply add your latest year of data, put it in the right format for the tool, and join it in `few_of_em`. The legislature doesn't provide emails, but the emails follow a generic formula based on the legislator's name that you can find in one of the previous years' spreadsheets.

The politics team often knows offhand if there's been an election and what changes have occured, so if you'd rather avoid starting from scratch you could just update this tool's spreadsheet. Just remember it won't be updated in the town lookup.
