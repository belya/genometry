var Genometry = {
  Triangle: function(options) {
    var color = options.color;
    var vertices = [{
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
        return vertices[index - 1];
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
        return color;
      },
      compareVertices: function(triangle) {
        for(var i = 0; i < 3; i++)
          if (triangle.vertex(i + 1).x != vertices[i].x || triangle.vertex(i + 1).y != vertices[i].y)
            return false;
        return true;
      },
      compareColor: function(triangle) {
        return (color.value == triangle.color().value);
      },
      compare: function(triangle) {
        return this.compareVertices(triangle) && this.compareColor(triangle);
      },
    };
  },
  VertexMutator: function() {
    var MAX_SHIFT = 5;
    return {
      mutate: function(triangle) {
        var index = Genometry.Utils.random(1, 3);
        var shiftX = Genometry.Utils.randomSign() * Genometry.Utils.random(1, MAX_SHIFT);
        var shiftY = Genometry.Utils.randomSign() * Genometry.Utils.random(1, MAX_SHIFT);
        triangle.vertex(index).x += shiftX;
        triangle.vertex(index).y += shiftY;
      }
    };
  },
  ColorMutator: function() {
    var MAX_SHIFT = 10;
    return {
      mutate: function(triangle) {
        var shift = Genometry.Utils.randomSign() * Genometry.Utils.random(1, MAX_SHIFT);
        triangle.color().value += shift;
      }
    };
  },
  Crossover: function() {
    return {
      cross: function(triangleOne, triangleTwo) {
        var mixedColor = (triangleOne.color().value + triangleTwo.color().value) / 2;
        var firstVertex = triangleOne.vertex(Genometry.Utils.random(1, 3));
        var secondVertex = triangleTwo.vertex(Genometry.Utils.random(1, 3));
        var thirdVertexX = 0;
        var thirdVertexY = 0;
        return new Genometry.Triangle({
          color: {
            value: Math.round(mixedColor)
          },
          vertex1: firstVertex,
          vertex2: secondVertex,
          vertex3: {
            x: thirdVertexX,
            y: thirdVertexY
          },
        });
      }
    }
  },
  Painter: function(canvas) {
    var context = canvas.getContext('2d');
    return {
      paint: function(triangle) {
        context.beginPath();
        context.moveTo(triangle.vertex(1).x, triangle.vertex(1).y);
        context.lineTo(triangle.vertex(2).x, triangle.vertex(2).y);
        context.lineTo(triangle.vertex(3).x, triangle.vertex(3).y);
        context.fillStyle = "#" + triangle.color().value.toString(16);
        context.fill();
      }
    };
  },
  ErrorCounter: function(canvas) {
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    return {
      count: function(canvas) {
        var error = 0;
        var anotherContext = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
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
      return (Math.random() > 0.5)?1:-1;
    },
  }
}