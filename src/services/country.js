const Country = require('../entities/Country');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('country').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (countries) => {
    const newCountries = [];

    for (const country of countries) {
      const newCountry = new Country(country);

      await newCountry.allRequiredAttributesAreFilledOrError();
      await newCountry.validAttributesOrError();
      await newCountry.uniqueConstraintInviolatedOrError();
      await newCountry.instanceDoesntExistOrError();

      newCountries.push(newCountry.getObject());
    }

    return app.db('country').insert(newCountries, ['id', 'name']);
  };

  const update = async (countryId, updatedCountry) => {
    const [currentCountry] = await read({ id: countryId });
    let newCountry = new Country({ ...currentCountry, ...updatedCountry });

    await newCountry.validAttributesOrError();
    await newCountry.allRequiredAttributesAreFilledOrError();
    await newCountry.uniqueConstraintInviolatedOrError(countryId);
    await newCountry.instanceDoesntExistOrError(countryId);

    newCountry = newCountry.getObject();
    newCountry.updated_at = 'now';

    return app.db('country').update(newCountry).where({ id: countryId });
  };

  const remove = async (countryId) => {
    await validator.notExistsInDbOrError('city', { country_id: countryId }, 'O país possui cidades associadas');
    await validator.notExistsInDbOrError('player', { nationality: countryId }, 'O país possui jogadores associados');

    return app.db('country').del().where({ id: countryId });
  };

  return {
    read, create, update, remove,
  };
};
