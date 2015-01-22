Linoleum.Grid = (function( Object , Array , Linoleum ) {


  function Grid( selector , options ) {

    var that = this;

    $.extend( true , that , options );

    that.rows = 0;
    that.cols = 0;

    that.size = {
      width: $(selector).outerWidth(),
      height: $(selector).outerHeight()
    };

    $(selector).toArray().map(function( element , i ) {
      var index = element.dataset[ Linoleum.INDEX ];
      if (index === undefined) {
        element.setAttribute( Linoleum.INDEX , i );
      }
      return element;
    })
    .sort(function( a , b ) {
      return Linoleum._getAttr( a , Linoleum.INDEX ) - Linoleum._getAttr( b , Linoleum.INDEX );
    })
    .forEach(function( element ) {
      that.push( element );
    });

    Object.defineProperties( that , {
      marginX: {
        get: function() {
          var margin = that.margin;
          return margin.left + margin.right;
        }
      },
      marginY: {
        get: function() {
          var margin = that.margin;
          return margin.top + margin.bottom;
        }
      },
      iSize: {
        get: function() {
          return {
            width: $(selector).outerWidth(),
            height: $(selector).outerWidth()
          };
        }
      },
      oSize: {
        get: function() {
          var iSize = that.iSize;
          return {
            width: iSize.width + ( that.marginX / 2 ),
            height: iSize.height + ( that.marginY / 2 )
          };
        }
      },
      tSize: {
        get: function() {
          var oSize = that.oSize;
          return {
            width: oSize.width * that.cols + that.marginX,
            height: oSize.height * that.rows + that.marginY
          };
        }
      }
    });

  }


  Grid.prototype = (function() {

    var proto = Object.create( Array.prototype );

    proto.distribute = function( container , options ) {
      
      var that = this;
      var layout = that._buildLayout( container );

      if (layout) {
        $(that)
        .hx()
        .detach()
        .clear()
        .defer( options.delay )
        .animate({
          type: 'transform',
          translate: function( element , i ) {
            return layout[i];
          },
          duration: options.duration,
          easing: options.easing
        });
        return true;
      }
      else {
        return false;
      }
    };

    proto._buildLayout = function( container ) {
      
      var that = this;
      var elements = that.slice( 0 );
      var c = that._getCols( container );
      var r = that._getRows( c );
      var layout = [];

      if (c != that.cols && r != that.rows) {
        for (var i = 0; i < r; i++) {
          for (var j = 0; j < c; j++) {
            layout.push({
              x: that._getX( j ),
              y: that._getY( i )
            });
          }
        }
        that.rows = r;
        that.cols = c;
      }
      else {
        layout = false;
      }

      return layout;
    };

    proto._getX = function( col ) {
      var that = this;
      var margin = that.margin;
      var iSize = that.iSize;
      return (iSize.width + that.marginX) * col + (that.marginX / 2);
    };

    proto._getY = function( row ) {
      var that = this;
      var margin = that.margin;
      var iSize = that.iSize;
      return (iSize.height + that.marginY) * row + (that.marginY / 2);
    };

    proto._getCols = function( container ) {
      var that = this;
      var length = that.length;
      var oSize = that.oSize;
      var bcr = container.getBoundingClientRect();
      var cols = Math.floor( bcr.width / oSize.width );
      return cols <= length ? cols : length;
    };

    proto._getRows = function( cols ) {
      var that = this;
      return Math.ceil( that.length / cols ) || 0;
    };

    return proto;

  }());


  return Grid;

  
}( Object , Array , Linoleum ));



























