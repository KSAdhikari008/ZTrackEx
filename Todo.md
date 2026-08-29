- start from APIdesign.md . add the following prompt on the Ex track app structure and design chat and get the api's
    - how is pagination done. In the TrackEx project i wanna show all the expneses so far on the expense list page.How should i approach that , do we send all the data and set the login on the frontend or do we do make changes or create a separate api for it.
    - for budget by category , do send all category budgets through a single api(GET /api/budget/category) or use param/query to get individual category budget.
    - Again IN the home page we are displaying the following things:
        - Total spend this month ( at the top)
        - Budget left(monthly)
        - Top food category 
        - spending by catogery ( show in a bar with diff colors for every category)
        - a list of recent expenses 
    Now tell me how the api routes should be set.

 
- when in frontend-desing 
    - ask claude for login and register ui image.

    - give all the possbile number of pages, keep minimal nums of pages. I am thinking
        - login/register
        - dashboard/home
        - expense list page (shows all expense, pagination or infinite scroll)
        - expense detials modal/drawer/page ( clicking on the expense on the list page)
        - expense edit modal/drawer/page ( sperate or one single page for edit and details both)

    - Brainstorm about what the features and details  should be there in the expense list page.
        - Where do we keep the filter option for category and date range, in the expense list page or somewhere else?
        - Do we show all the expense ever done in a pagination type layout or infinite scroll?
        - Should it  also have a summary/bar showing total expenses and budget status. 
        - How should the expense list look like, what info and how much info should it show about each expense, should it be a card or a list item, what info should be shown in the list item, should there be options to view details, edit, or delete each expense on the list page or just leave a edit/pencil option that options the expense detials modal where the use can take further actions, answer as if this is the expense schema 
        ``{
            name: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            category: {
                type: String,
                enum: ["Food", "Rent", "Travel", "Shopping", "Utilities", "Entertainment", "Health", "Other"],
                default: "Other"
            },
            date: {
                type: Date,
                default: Date.now
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }, { timestamps: true } ``
        . How will the mobile view and desktop differ.Give ui image.