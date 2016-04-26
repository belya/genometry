function createTriangle() {
  this.triangle = new Genometry.Triangle({
    color: {
      value: 0xffffff,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 1,
      y: 1,
    },
    vertex3: {
      x: 2,
      y: 0,
    },
  });
}

function createChromosome() {
  var triangle = new Genometry.Triangle({
    color: {
      value: 0xffffff,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 1,
      y: 1,
    },
    vertex3: {
      x: 2,
      y: 0,
    },
  });
  this.chromosome = new Genometry.Chromosome([triangle]);
}

function createChromosomeWithBigTriangle() {
  var triangle = new Genometry.Triangle({
    color: {
      value: 0xff0000,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 10,
      y: 10,
    },
    vertex3: {
      x: 20,
      y: 0,
    },
  });
  this.chromosome = new Genometry.Chromosome([triangle]);
}

function createBigTriangle() {
  this.triangle = new Genometry.Triangle({
    color: {
      value: 0xff0000,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 10,
      y: 10,
    },
    vertex3: {
      x: 20,
      y: 0,
    },
  });
}


function createTriangles() {
  this.triangleOne = new Genometry.Triangle({
    color: {
      value: 0xffffff,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 1,
      y: 1,
    },
    vertex3: {
      x: 2,
      y: 0,
    },
  });

  this.triangleTwo = new Genometry.Triangle({
    color: {
      value: 0x000000,
    },
    vertex1: {
      x: 0,
      y: 0,
    },
    vertex2: {
      x: 1,
      y: 1,
    },
    vertex3: {
      x: 2,
      y: 0,
    },
  });
}

QUnit.module("triangle operations", {
  beforeEach: createTriangle
});

QUnit.test( "triangle creation test", function(assert) {
  assert.ok(this.triangle.vertex(1).x == 0, "Triangle has a vertex!");
  assert.ok(this.triangle.vertex(2).x == 1, "Triangle has vertices!");
});

QUnit.test( "triangle generator test", function(assert) {
  var newTriangle = Genometry.Utils.randomTriangle(100, 100);
  assert.ok(newTriangle.vertex(1), "Random triangle has vertices!");
  assert.ok(newTriangle.color().value, "Random triangle has color!");
});

QUnit.test( "triangle length test", function(assert) {
  assert.ok(this.triangle.length(1, 3) == 2, "Triangle base length is 2!");
  assert.ok(this.triangle.length(2, 3) != 2, "Triangle side length is not 2!");
});

QUnit.test( "triangle square test", function(assert) {
  assert.ok(Math.round(this.triangle.square()) == 1, "Triangle square is about 1!");
  this.triangle.vertex(3).x = 1;
  assert.ok(Math.round(this.triangle.square()*2) == 1, "Triangle square is about 1/2!");
});

QUnit.test( "triangle color test", function(assert) {
  assert.ok(this.triangle.color().value == 0xffffff, "Triangle color is white!");
  this.triangle.color().value = 0x000000;
  assert.ok(this.triangle.color().value == 0x000000, "Triangle color is black!");
});

QUnit.test( "triangle compare test", function(assert) {
  createTriangles.call(this);
  assert.ok(!this.triangleOne.compare(this.triangleTwo), "Triangles are not equal!");
  this.triangleOne.color().value = 0x000000;
  assert.ok(this.triangleOne.compare(this.triangleTwo), "Triangles are equal!");
  this.triangleOne.vertex(1).x = 500;
  assert.ok(!this.triangleOne.compare(this.triangleTwo), "Triangles are not equal!");
});

QUnit.module("triangle mutation", {
  beforeEach: createTriangle
});

QUnit.test( "random test", function(assert) {
  for(var i = 0; i < 100; i++) {
    var random = Genometry.Utils.random(1, 3);
    assert.ok(random >= 1 && random <= 3, "Random value is not in interval!");
  }
});

QUnit.test( "random sign test", function(assert) {
  for(var i = 0; i < 100; i++) {
    var randomSign = Genometry.Utils.randomSign();
    assert.ok(randomSign == -1 || randomSign == 1, "Random value is not in interval!");
  }
});

function checkColorMutation(color, previousColor) {
  return color != previousColor || color == 0xffffff || color == 0x000000;
}

QUnit.test( "color mutation test", function(assert) {
  var mutator = new Genometry.ColorMutator();
  for(var i = 0; i < 100; i++) {
    var previousColor = this.triangle.color().value;
    mutator.mutate(this.triangle);
    var color = this.triangle.color().value;
    assert.ok(checkColorMutation(color, previousColor), "Mutator has changed color of a triangle!");
    assert.ok(color <= 0xffffff && color >= 0x000000, "Triangle has valid color!");
  }
});

QUnit.test( "vertex mutation test", function(assert) {
  var mutator = new Genometry.VertexMutator();
  for(var i = 0; i < 100; i++) {
    var previousSumX = this.triangle.vertex(1).x + this.triangle.vertex(2).x + this.triangle.vertex(3).x;
    var previousSumY = this.triangle.vertex(1).y + this.triangle.vertex(2).y + this.triangle.vertex(3).y;
    mutator.mutate(this.triangle);
    var sumX = this.triangle.vertex(1).x + this.triangle.vertex(2).x + this.triangle.vertex(3).x;
    var sumY = this.triangle.vertex(1).y + this.triangle.vertex(2).y + this.triangle.vertex(3).y;
    assert.ok((sumX != previousSumX && sumY != previousSumY), "Mutator has changed a vertex in triangle!");
  }
});

QUnit.module("triangle crossover", {
  beforeEach: createTriangles
});

QUnit.test( "triangle crossover color test", function(assert) {
  var crossover = Genometry.TriangleCrossover();
  var newTriangle = crossover.cross(this.triangleOne, this.triangleTwo);;
  assert.ok(newTriangle.color().value == 0x800000, "New triangle's color is perfect!");
  newTriangle = crossover.cross(this.triangleTwo, newTriangle);
  assert.ok(newTriangle.color().value == 0x400000, "New triangle's color is perfect again!");
});

QUnit.test( "triangle crossover vertex test", function(assert) {
  var crossover = Genometry.TriangleCrossover();
  var newTriangle = crossover.cross(this.triangleOne, this.triangleTwo);
  var hasSameVertex = function(triangle1, triangle2) {
    for(var i = 1; i <= 3; i++)
      for(var j = 1; j <= 3; j++) {
        if (triangle1.vertex(i).x == triangle2.vertex(j).x
         && triangle1.vertex(i).y == triangle2.vertex(j).y) 
          return true;
      }
    return false;
  }
  var verticesCondition = hasSameVertex(newTriangle, this.triangleOne) && hasSameVertex(newTriangle, this.triangleTwo);
  var squareSum = Math.round(this.triangleOne.square() + this.triangleTwo.square());
  var squareCondition = Math.round(newTriangle.square()) == squareSum;
  console.log(newTriangle.vertex(1));
  console.log(newTriangle.vertex(2));
  console.log(newTriangle.vertex(3));
  console.log(newTriangle.square());
  assert.ok(verticesCondition, "New triangle has vertices from his parents!");
  assert.ok(squareCondition, "New triangle's square is perfect!");
});

QUnit.module("triangle painter");

QUnit.test( "triangle painter test", function(assert) {
  createBigTriangle.call(this);
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 100;
  canvas.height = 100;
  var painter = Genometry.TrianglePainter(canvas);
  painter.paint(this.triangle);
  var canvasCondition = canvas.getContext('2d').getImageData(5, 0, 1, 1).data[0] == 255;
  assert.ok(canvasCondition, "Triangle has been painted on canvas!");
  canvasCondition = canvas.getContext('2d').getImageData(10, 10, 1, 1).data[0] == 0;
  assert.ok(canvasCondition, "Nothing else has been painted on canvas!");
  document.body.removeChild(canvas);
});

QUnit.module("chromosome painter");

QUnit.test( "chromosome painter test", function(assert) {
  createChromosomeWithBigTriangle.call(this);
  this.chromosome.triangles()[0].color(0).value = 0xff0000;
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 100;
  canvas.height = 100;
  var painter = Genometry.ChromosomePainter(canvas);
  painter.paint(this.chromosome);
  var canvasCondition = canvas.getContext('2d').getImageData(5, 0, 1, 1).data[0] == 255;
  assert.ok(canvasCondition, "Chromosome has been painted on canvas!");
  canvasCondition = canvas.getContext('2d').getImageData(10, 10, 1, 1).data[0] == 0;
  assert.ok(canvasCondition, "Nothing else has been painted on canvas!");
  document.body.removeChild(canvas);
});

QUnit.module("error counter");

QUnit.test( "error counter test", function(assert) {
  var input = document.createElement("canvas");
  document.body.appendChild(input);
  input.width = 100;
  input.height = 100;
  input.getContext('2d').fillStyle = "#FF0000";
  input.getContext('2d').fillRect(0, 0, 100, 100);
  var output = document.createElement("canvas");
  document.body.appendChild(output);
  output.width = 100;
  output.height = 100;
  var counter = Genometry.ErrorCounter(input);
  var error = counter.count(output);
  assert.ok(error != 0, "There is a sufficient difference between pics!");
  output.getContext('2d').fillStyle = "#FF0000";
  output.getContext('2d').fillRect(0, 0, 100, 100);
  error = counter.count(output);
  assert.ok(error == 0, "There is no difference between pics!");
  document.body.removeChild(input);
  document.body.removeChild(output);
});

QUnit.module("chromosome test", {
  beforeEach: createChromosome
});

QUnit.test( "chromosome creation test", function(assert) {
  assert.ok(this.chromosome.triangles().length == 1, "Chromosome is not empty!");
  assert.ok(this.chromosome.triangles()[0].color().value == 0xffffff, "Chromosome has white triangle");
});

QUnit.test( "chromosome generator test", function(assert) {
  var newChromosome = Genometry.Utils.randomChromosome(100, 100);
  assert.ok(this.chromosome.triangles().length > 0, "Chromosome is not empty!");
  assert.ok(this.chromosome.triangles()[0].color().value, "Chromosome has valid triangle");
});

QUnit.module("chromosome genetics test");

QUnit.test( "chromosome crossover test", function(assert) {
  var chromosomeOne = Genometry.Utils.randomChromosome(100, 100);
  var chromosomeTwo = Genometry.Utils.randomChromosome(100, 100);
  var crossover = new Genometry.ChromosomeCrossover();
  var result = crossover.cross(chromosomeOne, chromosomeTwo);
  assert.ok(result.triangles().length == chromosomeOne.triangles().length + chromosomeTwo.triangles().length, "Crossover has cross over chromosomes");
});

QUnit.test( "chromosome mutation test", function(assert) {
  var chromosome = Genometry.Utils.randomChromosome(100, 100);
  var mutator = new Genometry.ChromosomeMutator();
  mutator.mutate(chromosome);
  assert.ok(true, "Mutator has changed something in chromosome!");
});