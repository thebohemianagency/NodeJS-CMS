class stripeFeatures {
    constructor(stripeData, query) {
        this.query = query;
        this.stripeData = stripeData;
        this.totalRes;
    }
    //Category Filter
    //**FORM** ?category=hats
    category() {
        if (this.query.category) {
            var category = this.query.category;
            this.stripeData = this.stripeData.filter(function (el) {
                return el.metadata.category == category;
            });
        }
        return this;
    }


    rating() {
        if (this.query.rating) {
            if (this.query.rating == "h2l") {
                //lowest to highest
                this.stripeData = this.stripeData.sort((a, b) => Number(b.metadata.rating) - Number(a.metadata.rating));
            } else if (this.query.rating == "l2h") {
                //highest to lowest
                this.stripeData = this.stripeData.sort((a, b) => Number(a.metadata.rating) - Number(b.metadata.rating));
            }
        }
        return this;
    }
    //Rating Filter
    //**FORM** blog?rating=gte,7
    // rating() {
    //     if (this.query.rating) {
    //         var rating = this.query.rating.split(',')[1];
    //         if (this.query.rating.split(',')[0] == 'gt') {
    //             this.stripeData = this.stripeData.filter(function (el) {
    //                 return el.metadata.rating > rating;
    //             });
    //         }
    //         if (this.query.rating.split(',')[0] == 'gte') {
    //             this.stripeData = this.stripeData.filter(function (el) {
    //                 return el.metadata.rating >= rating;
    //             });
    //         }
    //         if (this.query.rating.split(',')[0] == 'lt') {
    //             this.stripeData = this.stripeData.filter(function (el) {
    //                 return el.metadata.rating < rating;
    //             });
    //         }
    //         if (this.query.rating.split(',')[0] == 'lte') {
    //             this.stripeData = this.stripeData.filter(function (el) {
    //                 return el.metadata.rating <= rating;
    //             });
    //         }
    //     }
    //     return this;
    // }
    //Price Sort
    //?price=h2l
    //?price=l2h
    price() {
        if (this.query.price) {
            if (this.query.price == "h2l") {
                //lowest to highest
                this.stripeData = this.stripeData.sort((a, b) => Number(b.metadata.price) - Number(a.metadata.price));
            } else if (this.query.price == "l2h") {
                //highest to lowest
                this.stripeData = this.stripeData.sort((a, b) => Number(a.metadata.price) - Number(b.metadata.price));
            }
        }
        return this;
    }
    //pagination
    //page=2&limit=3
    paginate() {
        this.totalRes = this.stripeData.length;
        var limit = this.query.limit || 5;
        var page = this.query.page || 1;
        var start = (page * limit) - limit;
        var end = page * limit;
        if (end >= this.totalRes) {
            end == this.totalRes
        }
        this.stripeData = this.stripeData.slice(start, end)
        return this;
    }

    //search
    //search=apple,sauce,dog
    search() {
        if (this.query.search) {
            //create array for incoming search term 
            var searchArr = this.query.search.split(',');

            //****INCOMING WORD ARRAY LIMIT 6 WORD,
            if (searchArr.length > 5) {
                searchArr = searchArr.slice(0, 5);
            }
            //Create Array For Search Results
            var searchResults = [];
            //initaite search parameter grading vs product keywords (200 product limit)
            this.stripeData.forEach(product => {

                var matchRating = 0;
                //array of search terms
                var keywordsArr = product.metadata.keywords.split(' ');
                //cross check each keyord of product with each word from the search entry

                keywordsArr.forEach(keyword => {
                    searchArr.forEach(searchItem => {

                        //Add positive match score
                        if (searchItem == keyword) {

                            matchRating++
                        }
                    });
                });
                //add matchQuailty atrribute to product object if a match
                if (matchRating > 0) {
                    product.searchRating = matchRating;

                    //add to array of search results
                    searchResults.push(product)
                }
            });
            //sort search results from highest match score to lowest match score
            this.stripeData = searchResults.sort((a, b) => Number(b.searchRating) - Number(a.searchRating));
        }
        return this;
    }
}
module.exports = stripeFeatures;