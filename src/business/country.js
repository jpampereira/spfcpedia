const Country = require('../entities/Country');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.country.read(filter);
  };

  const create = async (countries) => {
    const newCountries = [];

    for (const country of countries) {
      const newCountry = new Country(country);

      await newCountry.requiredAttrsAreFilledOrError();
      await newCountry.attrsValuesAreValidOrError();
      await newCountry.attrsWithUniqueValueOrError();
      await newCountry.oneXorAttrIsFilledOrError();
      await newCountry.instanceIsNotInDbOrError();

      newCountries.push(newCountry.getAttributes());
    }

    return app.services.country.create(newCountries);
  };

  const update = async (countryId, updatedCountry) => {
    const [currentCountry] = await read({ id: countryId });
    let newCountry = new Country(currentCountry);
    newCountry.setAttributes(updatedCountry);

    await newCountry.attrsValuesAreValidOrError();
    await newCountry.requiredAttrsAreFilledOrError();
    await newCountry.attrsWithUniqueValueOrError(countryId);
    await newCountry.oneXorAttrIsFilledOrError();
    await newCountry.instanceIsNotInDbOrError(countryId);

    newCountry = newCountry.getAttributes();
    newCountry.updated_at = 'now';

    return app.services.country.update(countryId, newCountry);
  };

  const remove = async (countryId) => {
    let [currentCountry] = await read({ id: countryId });
    currentCountry = new Country(currentCountry);

    await currentCountry.dataIsNotForeignKeyOrError(countryId);

    return app.services.country.remove(countryId);
  };

  return { read, create, update, remove };
};
