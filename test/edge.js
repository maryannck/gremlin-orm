const gremlinOrm = require('./../dist/gremlin-orm');
const g = new gremlinOrm('neo4j');

const { assert, expect } = require('chai');

const Person = g.define('person', {
  'name': {
    type: g.STRING,
    required: true
  },
  'age' : {
    type: g.NUMBER
  },
  'dob' : {
    type: g.DATE
  },
  'developer' : {
    type: g.BOOLEAN
  }
});

const Knows = g.defineEdge('knows', {
  'duration': {
    type: g.NUMBER,
    required: true
  }
});

let john;
let bob;

describe('Edge Model', () => {
  beforeEach(done => {
    g.queryRaw('g.V().drop()', () => {
      Person.create({'name': 'John', 'age': 18, 'dob': '12/18/1999', developer: true}, (err, result) => {
        john = result;
        Person.create({'name': 'Bob', 'age': 23, 'dob': '04/30/1994', developer: false}, (err, result) => {
          bob = result;
          done();
        });
      });
    });
  });
  
  describe('Define', () => {
    it('Should define a new edge model called Knows', () => {
      expect(Knows.create).to.be.a('function');
    });
  });

  describe('Create', () => {
    it('Should create a new edge with valid properties', (done) => {
      Knows.create(john, bob, {duration: 5}, (err, result) => {
        expect(result).to.have.property('id');
        expect(result.label).to.equal('knows');
        expect(result.duration).to.equal(5);
        expect(result).to.have.property('outV');
        expect(result).to.have.property('inV');
        done();
      });
    });
    // it('Should not create an edge if required property is missing', (done) => {
    //   Knows.create(john, bob, (err, result) => {
    //     expect(result).to.equal(undefined);
    //     done();
    //   });
    // })
  });
});
