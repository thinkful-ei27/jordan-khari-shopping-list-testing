'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');


const expect = chai.expect;


chai.use(chaiHttp);

describe('recipes', function(){

  before(function(){
    return runServer();
  });

  after(function(){
    return closeServer();
  });



  it('Should return all receipes', function(){
    return chai
      .request(app)
      .get('/recipes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body.length).to.be.at.least(1);

        const expectedKeys= ['name','id','ingredients'];
        res.body.forEach(item =>{
          expect(item).to.be.a.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should add a recipe on POST', function(){
    const newItem = {name: 'dinner', id: 9000, ingredients: ['macaroni', 'cheese']};
    return chai
      .request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('name', 'id', 'ingredients');
        expect(res.body.ingredients).to.be.a('array');
        expect(res.body.id).to.not.equal(null);

        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        );
      });
  });


  

});