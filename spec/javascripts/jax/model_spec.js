describe("Jax.Model", function() {
  var model;
  
  describe("without any custom methods", function() {
    beforeEach(function() {
      model = Jax.Model.create({});
    });
  
    it("should fire after_initialize", function() {
      model.addResources({
        "name": {
          fired: false
        }
      });
    
      model.addMethods({ after_initialize: function() { this.fired = true; } });
    
      expect(model.find("name").fired).toBeTrue();
    });

    it("should assign attribute values", function() {
      model.addResources({
        "name": {
          one: "one"
        }
      });
    
      expect(model.find("name").one).toEqual("one");
    });
  
    it("should instantiate a model without default attributes", function() {
      expect(function() { new model(); }).not.toThrow(Error);
    });
  });
  
  describe("with a custom method", function() {
    beforeEach(function() {
      model = Jax.Model.create({method: function() { return "called"; } });
    });
    
    it("should work", function() {
      expect(new model().method()).toEqual("called");
    });
  });
});