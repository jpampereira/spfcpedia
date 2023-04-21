module.exports = {
  HTTP_SUCCESS: 200,
  HTTP_CREATED: 201,
  HTTP_NO_CONTENT: 204,
  HTTP_BAD_REQUEST: 400,
  HTTP_SERVER_ERROR: 500,
  REQUIRED_ATTRIBUTE_ERROR: 'O atributo <ATTR_NAME> é obrigatório',
  INVALID_ATTRIBUTE_ERROR: 'O valor de <ATTR_NAME> é inválido',
  UNIQUE_CONSTRAINT_ERROR: 'Já existe um registro com esse <ATTR_NAME>',
  DOUBLE_INSTANCE_ERROR: 'Registro já cadastrado',
  LIST_SIZE_ERROR: 'O número de itens em <ENTITY_NAME> é inválido',
  DOUBLED_LIST_ITEM_ERROR: 'Todos os <ATTR_NAME> de um mesmo <ENTITY_NAME> devem possuir valores diferentes',
  SINGLED_LIST_ITEM_ERROR: 'Todos os <ATTR_NAME> de um mesmo <ENTITY_NAME> devem possuir o mesmo valor',
};
