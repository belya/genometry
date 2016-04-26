var Genometry = {
  Triangle: function(options) {
    var _color = options.color;
    var _vertices = [{
      x: options.vertex1.x,
      y: options.vertex1.y,
    }, {
      x: options.vertex2.x,
      y: options.vertex2.y,
    }, {
      x: options.vertex3.x,
      y: options.vertex3.y,
    }];
    return {
      vertex: function(index) {
        return _vertices[index - 1];
      },
      length: function(index1, index2) {
        return Math.sqrt(Math.pow(this.vertex(index1).x - this.vertex(index2).x, 2) 
        + Math.pow(this.vertex(index1).y - this.vertex(index2).y, 2));
      },
      square: function() {
        var halfPerimeter = (this.length(1, 3) + this.length(2, 3) + this.length(1, 2)) / 2;
        var bracketsOne = halfPerimeter - this.length(1, 3);
        var bracketsTwo = halfPerimeter - this.length(2, 3);
        var bracketsThree = halfPerimeter - this.length(1, 2);
        var squaredSquare = halfPerimeter * bracketsOne * bracketsTwo * bracketsThree;
        return Math.sqrt(squaredSquare);
      },
      color: function() {
        return _color;
      },
      compareVertices: function(triangle) {
        for(var i = 0; i < 3; i++)
          if (triangle.vertex(i + 1).x != _vertices[i].x || triangle.vertex(i + 1).y != _vertices[i].y)
            return false;
        return true;
      },
      compareColor: function(triangle) {
        return (_color.value == triangle.color().value);
      },
      compare: function(triangle) {
        return this.compareVertices(triangle) && this.compareColor(triangle);
      },
    };
  },
  Chromosome: function(triangles) {
    var _triangles = triangles;
    return {
      triangles: function() {
        return _triangles;
      }
    };
  },
  VertexMutator: function() {
    var _MAX_SHIFT = 5;
    return {
      mutate: function(triangle) {
        var index = Genometry.Utils.random(1, 3);
        var shiftX = Genometry.Utils.randomSign() * Genometry.Utils.random(1, _MAX_SHIFT);
        var shiftY = Genometry.Utils.randomSign() * Genometry.Utils.random(1, _MAX_SHIFT);
        triangle.vertex(index).x += shiftX;
        triangle.vertex(index).y += shiftY;
      }
    };
  },
  ColorMutator: function() {
    var _MAX_SHIFT = 10;
    return {
      mutate: function(triangle) {
        var shift = Genometry.Utils.randomSign() * Genometry.Utils.random(1, _MAX_SHIFT);
        triangle.color().value += shift;
        if (triangle.color().value > 0xffffff) 
          triangle.color().value = 0xffffff;
        if (triangle.color().value < 0x000000)
          triangle.color().value = 0x000000;
      }
    };
  },
  ChromosomeMutator: function(width, height) {
    var _width = width;
    var _height = height;
    var _vertexMutator = new Genometry.VertexMutator();
    var _colorMutator  = new Genometry.ColorMutator();
    var _modifyTriangle = function(chromosome) {
      var index = Genometry.Utils.random(0, chromosome.triangles().length - 1);
      if (Math.random > 0.5)
        _vertexMutator.mutate(chromosome.triangles()[index]);
      else
        _colorMutator.mutate(chromosome.triangles()[index]);
    }
    var _addTriangle = function(chromosome) {
      var triangle = Genometry.Utils.randomTriangle(_width, _height);
      chromosome.triangles().push(triangle);
    }
    var _deleteTriangle = function(chromosome) {
      var index = Genometry.Utils.random(0, chromosome.triangles().length - 1);
      chromosome.triangles().splice(index, 1);
    }
    return {
      mutate: function(chromosome) {
        var random = Math.random();
        if (random > 0.5)
          _modifyTriangle(chromosome);
        else if (random > 0.25)
          _deleteTriangle(chromosome);
        else
          _addTriangle(chromosome);
      }
    }
  },
  TriangleCrossover: function() {
    return {
      cross: function(triangleOne, triangleTwo) {
        var mixedColor = (triangleOne.color().value + triangleTwo.color().value) / 2;
        var firstVertex = triangleOne.vertex(Genometry.Utils.random(1, 3));
        var secondVertex = triangleTwo.vertex(Genometry.Utils.random(1, 3));
        var resultSquare = triangleOne.square() + triangleTwo.square();
        var triangle = new Genometry.Triangle({
          color: {
            value: Math.round(mixedColor)
          },
          vertex1: firstVertex,
          vertex2: secondVertex,
          vertex3: {x: 0, y: 0},
        });
        if (firstVertex.x != secondVertex.x && firstVertex.y != secondVertex.y) {
          var length = resultSquare * 2 / triangle.length(1, 2);
          var baseVectorX = Math.abs(triangle.vertex(1).x, triangle.vertex(2).x);
          var baseVectorY = Math.abs(triangle.vertex(1).y, triangle.vertex(2).y);
          var halfX = baseVectorX / 2 + Math.min(triangle.vertex(1).x, triangle.vertex(2).x);
          var halfY = baseVectorY / 2 + Math.min(triangle.vertex(1).y, triangle.vertex(2).y);
          var cosOY = baseVectorY / triangle.length(1, 2);
          var angle = Math.acos(cosOY);
          triangle.vertex(3).x = halfX + Math.cos(angle) * length;
          triangle.vertex(3).y = halfY - Math.sin(angle) * length;
        }
        return triangle;

      }
    }
  },
  ChromosomeCrossover: function() {
    var _triangleCrossover = Genometry.TriangleCrossover();
    return {
      cross: function(chromosomeOne, chromosomeTwo) {
        return new Genometry.Chromosome(chromosomeTwo.triangles().concat(chromosomeOne.triangles()));
        // var mixedNumber = Genometry.Utils.random(0, chromosome.triangles().length);
        // for(var i = 0; i < mixedNumber; i++) {
        //   var index1 =;
        //   var index2 =;

        // }
      },
    };
  },
  Painter: function(canvas) {
    var _context = canvas.getContext('2d');
    return {
      paint: function(triangle) {
        _context.beginPath();
        _context.moveTo(triangle.vertex(1).x, triangle.vertex(1).y);
        _context.lineTo(triangle.vertex(2).x, triangle.vertex(2).y);
        _context.lineTo(triangle.vertex(3).x, triangle.vertex(3).y);
        _context.fillStyle = "#" + triangle.color().value.toString(16);
        _context.fill();
      }
    };
  },
  ErrorCounter: function(canvas) {
    var _context = canvas.getContext('2d');
    var _width = canvas.width;
    var _height = canvas.height;
    return {
      count: function(canvas) {
        var error = 0;
        var anotherContext = canvas.getContext('2d');
        var imageData = _context.getImageData(0, 0, _width, _height);
        var anotherImageData = anotherContext.getImageData(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < imageData.data.length; i++) {
          if (anotherImageData.data.length <= i) break;
          error += Math.pow(imageData.data[i] - anotherImageData.data[i], 2) / 2;
        }
        return error;
      }
    }
  },
  Utils: {
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomSign: function() {
      return (Math.random() > 0.5) ? 1 : -1;
    },
    randomTriangle: function(width, height) {
      return new Genometry.Triangle({
        color: {
          value: Genometry.Utils.random(0, 0xffffff),
        },
        vertex1: {
          x: Genometry.Utils.random(-width, width),
          y: Genometry.Utils.random(-height, height),
        },
        vertex2: {
          x: Genometry.Utils.random(-width, width),
          y: Genometry.Utils.random(-height, height),
        },
        vertex3: {
          x: Genometry.Utils.random(-width, width),
          y: Genometry.Utils.random(-height, height),
        }
      });
    },
    randomChromosome: function(width, height) {
      var triangles = [];
      var length = Genometry.Utils.random(1, 10);
      for(var i = 0; i < length; i++)
        triangles.push(Genometry.Utils.randomTriangle(width, height));
      return new Genometry.Chromosome(triangles);
    },
  }
}
