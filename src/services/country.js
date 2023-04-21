const Country = require('../entities/Country');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('country').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (countries) => {
    const newCountries = [];

    for (const country of countries) {
      const newCountry = new Country(country);

      await newCountry.requiredAttributesAreFilledOrError();
      await newCountry.attributesValueAreValidOrError();
      await newCountry.uniqueConstraintInviolatedOrError();
      await newCountry.instanceDoesntExistInDbOrError();

      newCountries.push(newCountry.getAttributes());
    }

    return app.db('country').insert(newCountries, ['id', 'name']);
  };

  const update = async (countryId, updatedCountry) => {
    const [currentCountry] = await read({ id: countryId });
    let newCountry = new Country({ ...currentCountry, ...updatedCountry });

    await newCountry.attributesValueAreValidOrError();
    await newCountry.requiredAttributesAreFilledOrError();
    await newCountry.uniqueConstraintInviolatedOrError(countryId);
    await newCountry.instanceDoesntExistInDbOrError(countryId);

    newCountry = newCountry.getAttributes();
    newCountry.updated_at = 'now';

    return app.db('country').update(newCountry).where({ id: countryId });
  };

  const remove = async (countryId) => {
    let [currentCountry] = await read({ id: countryId });
    currentCountry = new Country(currentCountry);

    await currentCountry.dependentEntitiesDoesntHaveDataOrError(countryId);

    return app.db('country').del().where({ id: countryId });
  };

  return {
    read, create, update, remove,
  };
};
