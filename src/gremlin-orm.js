const Gremlin = require('gremlin');
const VertexModel = require('./vertex-model');
const EdgeModel = require('./edge-model');

class Gorm {
  constructor(dialect, port, url, options) {
    const argLength = arguments.length;
    if (argLength == 0) {
      return null;
    } else if (argLength == 1) {
      this.client = Gremlin.createClient();
    } else if (argLength == 3) {
      this.client = Gremlin.createClient(port, url);
    } else {
      this.client = Gremlin.createClient(port, url, options);
    }

    if (Array.isArray(dialect)) {
      this.dialect = dialect[0];
      this.partition = dialect[1];
    }
    else {
      this.dialect = dialect;
    }

  }

  define(label, schema) {
    return defineVertex(label, schema);
  }

  defineVertex(label, schema) {
    return new VertexModel(label, schema, this.client, this.dialect, this.partition);
  }

  defineEdge(label, schema) {
    return new EdgeModel(label, schema, this.client, this.dialect, this.partition);
  }

  checkSchema(schema, props, checkRequired) {
    const schemaKeys = Object.keys(schema);
    const propsKeys = Object.keys(props);
    
    if (checkRequired) {
      schemaKeys.forEach(key => {
        if ((schema[key].allowNull !== undefined) && (schema[key].allowNull === false)) {
          if (!propsKeys.includes(key)) return false;
        }
      });
    }

    propsKeys.forEach(key => {
      if (!schemaKeys.includes(key)) return false;
      if (props[key].constructor !== schema[key].type) return false; 
    });
  
    return true;
  }

  stringifyValue(value) {
    if (typeof value === 'string') {
      return `'${value}'`;
    } else {
      return `${value}`;
    }
  }

}

module.exports = Gorm;