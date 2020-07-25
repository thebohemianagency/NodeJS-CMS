class mongoFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        this.totalRes = 0;
    }

    // FILTER
    // blog?category=xxx
    // blog?category=xxx&sort=ratingAvg
    // blog?rating[gte]=7
    filter() {
        const queryObj = {
            ...this.queryStr
        };
        const excludedFields = ["page", "limit", "fields", "sort"];
        excludedFields.forEach(el => delete queryObj[el])
        // Query Advanced greater than / less than (price less than)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;

    }
    //SORT
    //?sort=category
    //?sort=price - highest -> lowest
    //?sort=-price - lowest -> highest
    //?sort=price,rating - 2fields
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-timeCreated");
        }
        return this;
    }

    //LIMIT Fields
    //?fields=description,-content
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    //Pagination
    //page=2&limit=10
    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = parseInt(this.queryStr.limit);
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }


}

module.exports = mongoFeatures;