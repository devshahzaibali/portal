// Small helper for building the public job search/filter/pagination query.
// Kept deliberately simple and explicit rather than a generic "magic" query builder,
// so it's obvious in the controller what filters are actually supported.
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // mongoose Query object
    this.queryString = queryString; // req.query
  }

  filter() {
    const { keyword, location, workMode, type, skills } = this.queryString;
    const filters = {};

    if (keyword) {
      filters.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }
    if (workMode) {
      filters.workMode = workMode;
    }
    if (type) {
      filters.type = type;
    }
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filters.skills = { $in: skillsArray };
    }

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  async paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
