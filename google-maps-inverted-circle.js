function InitInvertedCircle() {

  /*
  * https://github.com/lmachens/google-maps-inverted-circle
  * Copyright (c) 2013 Miah Raihan Mahmud Arman
  * Copyright (c) 2015 Leon Machens
  * Released under the MIT licence: http://opensource.org/licenses/mit-license
  * Note: The Google Maps API v3 must be included *before* this code
  */

  function InvertedCircle(opts) {
    var options = {
      visible: true,
      map: opts.map,
      center: opts.map.getCenter(),
      radius: 200000, // 200 km
      draggable: false,
      editable: false,
      stroke_weight: 1,
      stroke_color: '#000',
      fill_opacity: 0.3,
      fill_color: "#000",
      always_fit_to_map: false,
      radius_style: "background: #fff; border: 1px solid black; position: absolute;",
      position_changed_event: function() {},
      radius_changed_event: function() {}
    }
    options = this.extend_(options, opts);
    this.set('visible', options.visible);
    this.set('map', options.map);
    this.set('center', options.center);
    this.set('radius', options.radius);
    this.set('old_radius', options.radius);
    this.set('draggable', options.draggable);
    this.set('editable', options.editable);
    this.set('stroke_weight', options.stroke_weight);
    this.set('stroke_color', options.stroke_color);
    this.set('fill_opacity', options.fill_opacity);
    this.set('fill_color', options.fill_color);
    this.set('always_fit_to_map', options.always_fit_to_map);
    this.set('position', options.center);
    this.set('resize_leftright', options.resize_leftright);
    this.set('resize_updown', options.resize_updown);
    this.set('center_icon', options.center_icon);
    this.set('position_changed_event', options.position_changed_event);
    this.set('radius_changed_event', options.radius_changed_event);

    // Add the center marker
    this.addCenter_();

    // Draw the inverse circle
    this.drawCircle_(this.get('map'), this.get('position'), this.get('radius') / 1000);

    // Add the sizer marker
    this.addSizer_();

    // Add a text overlay for the radius
    this.radiusOverlay = new TextOverlay("radiusOverlay", this.get('map'), options.radius_style);
  //this.addVisibleController_();
  }

  InvertedCircle.prototype = new google.maps.MVCObject();

  InvertedCircle.prototype.position_changed = function()
  {
    this.set('center', this.get('position'));
    if(this.get('donut')){
      var paths = new this.Overlay;
      var spot = this.drawSpot_(this.getCenter(), this.getRadius() / 1000);
      for (var i = 0; i < spot.length; i++) {
        paths.push(spot[i]);
      }
      this.set('paths', paths);
      if(this.getVisible())
        this.get('donut').setPaths(paths);
    }
    if(this.get('sizer_left') && this.get('sizer_right') && this.get('sizer_up') && this.get('sizer_down')){
      var left_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), -90);
      var right_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 90);
      var up_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 360);
      var down_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 180);
      this.get('sizer_left').setPosition(left_endpoint);
      this.get('sizer_right').setPosition(right_endpoint);
      this.get('sizer_up').setPosition(up_endpoint);
      this.get('sizer_down').setPosition(down_endpoint);
    }
  };

  InvertedCircle.prototype.radius_changed = function()
  {
    if(this.get('donut')){
      var paths = new this.Overlay;
      var spot = this.drawSpot_(this.getCenter(), this.getRadius() / 1000);
      for (var i = 0; i < spot.length; i++) {
        paths.push(spot[i]);
      }
      this.set('paths', paths);
      if(this.getVisible())
        this.get('donut').setPaths(paths);
    }
    if(this.get('sizer_left') && this.get('sizer_right') && this.get('sizer_up') && this.get('sizer_down')){
      var left_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), -90);
      var right_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 90);
      var up_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 360);
      var down_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 180);
      this.get('sizer_left').setPosition(left_endpoint);
      this.get('sizer_right').setPosition(right_endpoint);
      this.get('sizer_up').setPosition(up_endpoint);
      this.get('sizer_down').setPosition(down_endpoint);
    }
  };

  InvertedCircle.prototype.visible_changed = function()
  {
    this.setEditable(this.getVisible());
    this.setDraggable(this.getVisible());
    if(this.getVisible()){
      if(this.get('donut'))
        this.get('donut').setPaths(this.get('paths'));
    }else{
      if(this.get('donut'))
        this.get('donut').setPaths([]);
    }
  }

  InvertedCircle.prototype.setMap = function(map)
  {
    this.set('map', map);
  }

  InvertedCircle.prototype.getMap = function()
  {
    return this.get('map');
  }

  InvertedCircle.prototype.setVisible = function(visible)
  {
    this.set('visible', visible);
  /*if(this.get('visible')){
        this.get('circleControlDiv').innerHTML = '<div style="direction: ltr; overflow: hidden; text-align: left; position: relative; color: rgb(0, 0, 0); font-family: Arial, sans-serif; -webkit-user-select: none; font-size: 13px; background-color: rgb(255, 255, 255); padding: 4px; border-width: 1px 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-top-color: rgb(113, 123, 135); border-right-color: rgb(113, 123, 135); border-bottom-color: rgb(113, 123, 135); -webkit-box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; font-weight: bold; background-position: initial initial; background-repeat: initial initial; " title="Turn On/Off the Circle"><span><div style="width: 16px; height: 16px; overflow: hidden; position: relative; "><img style="position: absolute; left: 0px; top: 0px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px; width: auto; height: auto; " src="http://maps.gstatic.com/mapfiles/drawing.png" draggable="false"></div></span></div>';
      }else{
        this.get('circleControlDiv').innerHTML = '<div style="direction: ltr; overflow: hidden; text-align: left; position: relative; color: rgb(51, 51, 51); font-family: Arial, sans-serif; -webkit-user-select: none; font-size: 13px; background-color: rgb(255, 255, 255); padding: 4px; border-width: 1px 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-top-color: rgb(113, 123, 135); border-right-color: rgb(113, 123, 135); border-bottom-color: rgb(113, 123, 135); -webkit-box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; font-weight: normal; background-position: initial initial; background-repeat: initial initial; " title="Turn On/Off the Circle"><span><div style="width: 16px; height: 16px; overflow: hidden; position: relative; "><img style="position: absolute; left: 0px; top: -160px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px; width: auto; height: auto; " src="http://maps.gstatic.com/mapfiles/drawing.png" draggable="false"></div></span></div>';
      }*/
  };

  InvertedCircle.prototype.getVisible = function()
  {
    return this.get('visible');
  };

  InvertedCircle.prototype.setCenter = function(center)
  {
    this.set('position', center);
    this.get('position_changed_event').call(this, center);
  };

  InvertedCircle.prototype.getCenter = function()
  {
    return this.get('position');
  };

  InvertedCircle.prototype.getRadius = function()
  {
    return this.get('radius');
  };

  InvertedCircle.prototype.setRadius = function(radius)
  {
    this.set('radius', radius);
    this.get('radius_changed_event').call(this, radius);
  };

  InvertedCircle.prototype.getOldRadius = function()
  {
    return this.get('old_radius');
  };

  InvertedCircle.prototype.setOldRadius = function(radius)
  {
    this.set('old_radius', radius);
  };


  InvertedCircle.prototype.getEditable = function()
  {
    return this.get('editable');
  };

  InvertedCircle.prototype.setEditable = function(editable)
  {
    this.set('editable', editable);
  };

  InvertedCircle.prototype.getDraggable = function()
  {
    return this.get('draggable');
  };

  InvertedCircle.prototype.setDraggable = function(draggable)
  {
    this.set('draggable', draggable);
  };

  InvertedCircle.prototype.getBounds = function()
  {
    var old_radius = this.getOldRadius();
    var radius = this.getRadius();
    //console.log(old_radius);
    //console.log(radius);
    var bound_radius, center, bounds, left_bound, right_bound, up_bound, down_bound;
    center = this.getCenter();
    bounds = new google.maps.LatLngBounds();
    if(old_radius < radius){
      //console.log('old_radius < radius');
      bound_radius = radius * 1.1;
      if(bound_radius > (6371 * 1000)){
        bound_radius = 6371 * 1000;
      }
      //console.log('bound_radius = ' + bound_radius);
      left_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, -90);
      right_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 90);
      up_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 360);
      down_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 180);
    }
    if(old_radius > radius){
      //console.log('old_radius > radius');
      bound_radius = radius / 2.5;
      if(bound_radius < 0){
        bound_radius = 0;
      }
      //console.log('bound_radius = ' + bound_radius);
      left_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, -90);
      right_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 90);
      up_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 360);
      down_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 180);
    }

    if(old_radius == radius){
      console.log('old_radius == radius');
    // bound_radius = radius;
      left_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, -90);
      right_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 90);
      up_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 360);
      down_bound = google.maps.geometry.spherical.computeOffset(center, bound_radius, 180);
    }

    /*console.log(left_bound);
      console.log(right_bound);
      console.log(up_bound);
      console.log(down_bound);*/

    bounds.extend(left_bound);
    bounds.extend(right_bound);
    bounds.extend(up_bound);
    bounds.extend(down_bound);

    /*var bounds = new google.maps.LatLngBounds();
      bounds.extend(this.get('sizer_left').getPosition());
      bounds.extend(this.get('sizer_right').getPosition());
      bounds.extend(this.get('sizer_up').getPosition());
      bounds.extend(this.get('sizer_down').getPosition());*/
    return bounds;
  };

  /**
    * Add the center marker to the map.
    *
    * @private
    */
  InvertedCircle.prototype.addCenter_ = function() {
    var center_icon = new google.maps.MarkerImage(this.get('center_icon'),
      // second line defines the dimensions of the image
      new google.maps.Size(20, 20),
      // third line defines the origin of the custom icon
      new google.maps.Point(0,0),
      // and the last line defines the offset for the image
      new google.maps.Point(10, 10)
      );

    var center_marker = new google.maps.Marker({
      position: this.getCenter(),
      title: 'Drag me!',
      raiseOnDrag: false,
      icon: center_icon
    });

    // Bind the marker map property to the InvertedCircle map property
    center_marker.bindTo('map', this);
    center_marker.bindTo('draggable', this);

    // Bind the marker position property to the InvertedCircle position property
    center_marker.bindTo('position', this);
    this.set('center_marker', center_marker);

    var me = this;

    google.maps.event.addListener(center_marker, 'drag', function() {
      me.setCenter(me.get('center_marker').getPosition());
    });
  }

  /**
    * Add the sizer markers to the map.
    *
    * @private
    */
  InvertedCircle.prototype.addSizer_ = function() {
    var sizer_icon_left_right = new google.maps.MarkerImage(this.get('resize_leftright'),
      // second line defines the dimensions of the image
      new google.maps.Size(29, 29),
      // third line defines the origin of the custom icon
      new google.maps.Point(0,0),
      // and the last line defines the offset for the image
      new google.maps.Point(15, 15)
      );

    var sizer_icon_up_down = new google.maps.MarkerImage(this.get('resize_updown'),
      // second line defines the dimensions of the image
      new google.maps.Size(29, 29),
      // third line defines the origin of the custom icon
      new google.maps.Point(0,0),
      // and the last line defines the offset for the image
      new google.maps.Point(15, 15)
      );

    var left_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), -90);
    var sizer_left = new google.maps.Marker({
      position: left_endpoint,
      //title: 'Drag me!',
      raiseOnDrag: false,
      icon: sizer_icon_left_right
    });

    var right_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 90);
    var sizer_right = new google.maps.Marker({
      position: right_endpoint,
      //title: 'Drag me!',
      raiseOnDrag: false,
      icon: sizer_icon_left_right
    });

    var up_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 360);
    var sizer_up = new google.maps.Marker({
      position: up_endpoint,
      //title: 'Drag me!',
      raiseOnDrag: false,
      icon: sizer_icon_up_down,
      visible: false
    });

    var down_endpoint = google.maps.geometry.spherical.computeOffset(this.getCenter(), this.getRadius(), 180);
    var sizer_down = new google.maps.Marker({
      position: down_endpoint,
      //title: 'Drag me!',
      raiseOnDrag: false,
      icon: sizer_icon_up_down,
      visible: false
    });

    sizer_left.bindTo('map', this, 'map');
    sizer_left.bindTo('visible', this, 'editable');
    sizer_left.bindTo('draggable', this, 'editable');
    sizer_right.bindTo('map', this, 'map');
    sizer_right.bindTo('visible', this, 'editable');
    sizer_right.bindTo('draggable', this, 'editable');
    sizer_up.bindTo('map', this, 'map');
    sizer_up.bindTo('draggable', this, 'editable');
    sizer_down.bindTo('map', this, 'map');
    sizer_down.bindTo('draggable', this, 'editable');

    this.set('sizer_left', sizer_left);
    this.set('sizer_right', sizer_right);
    this.set('sizer_up', sizer_up);
    this.set('sizer_down', sizer_down);

    var me = this;

    google.maps.event.addListener(sizer_left, 'dragstart', function() {
      me.setOldRadius(me.getRadius());
    });

    google.maps.event.addListener(sizer_left, 'mouseover', function() {
      var icon = me.get('sizer_left').getIcon();
      icon.origin = new google.maps.Point(0,29);
      me.get('sizer_left').setIcon(icon);
    });

    google.maps.event.addListener(sizer_left, 'mouseout', function() {
      var icon = me.get('sizer_left').getIcon();
      icon.origin = new google.maps.Point(0,0);
      me.get('sizer_left').setIcon(icon);
    });

    google.maps.event.addListener(sizer_right, 'dragstart', function() {
      me.setOldRadius(me.getRadius());
    });

    google.maps.event.addListener(sizer_right, 'mouseover', function() {
      var icon = me.get('sizer_right').getIcon();
      icon.origin = new google.maps.Point(0,29);
      me.get('sizer_right').setIcon(icon);
    });

    google.maps.event.addListener(sizer_right, 'mouseout', function() {
      var icon = me.get('sizer_right').getIcon();
      icon.origin = new google.maps.Point(0,0);
      me.get('sizer_right').setIcon(icon);
    });

    google.maps.event.addListener(sizer_left, 'drag', function() {
      var radius = google.maps.geometry.spherical.computeDistanceBetween(me.getCenter(), me.get('sizer_left').getPosition());
      me.setRadius(radius);
      me.showRadius_(me.get('sizer_left').getPosition());
    });

    google.maps.event.addListener(sizer_right, 'drag', function() {
      var radius = google.maps.geometry.spherical.computeDistanceBetween(me.getCenter(), me.get('sizer_right').getPosition());
      me.setRadius(radius);
      me.showRadius_(me.get('sizer_right').getPosition());
    });

    google.maps.event.addListener(sizer_left, 'dragend', function() {
      var radius = google.maps.geometry.spherical.computeDistanceBetween(me.getCenter(), me.get('sizer_right').getPosition());
      me.radiusOverlay.hide();
      me.setRadius(radius);
      /*var old_radius = me.getOldRadius();
        var radius = me.getRadius();
        console.log("Old " + old_radius);
        console.log("Current " + radius);*/
      if(me.get('always_fit_to_map')){
        me.get('map').fitBounds(me.getBounds());
      }
    });

    google.maps.event.addListener(sizer_right, 'dragend', function() {
      var radius = google.maps.geometry.spherical.computeDistanceBetween(me.getCenter(), me.get('sizer_right').getPosition());
      me.radiusOverlay.hide();
      me.setRadius(radius);
      /*var old_radius = me.getOldRadius();
        var radius = me.getRadius();
        console.log("Old " + old_radius);
        console.log("Current " + radius);*/
      if(me.get('always_fit_to_map')){
        me.get('map').fitBounds(me.getBounds());
      }
    });
  };

  InvertedCircle.prototype.showRadius_ = function(position) {
    var contentString = parseFloat(Math.round(this.getRadius()) / 1000).toFixed(2) + ' km';
    this.radiusOverlay.setText(contentString, position);
  }

  /**
    * This is to draw Circle Visible Control button
    *
    * @private
    */
  InvertedCircle.prototype.addVisibleController_ = function() {
    // Create the DIV to hold the control and call the HomeControl() constructor
    // passing in this DIV.
    this.set('circleControlDiv', document.createElement('div'));
    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map.
    this.get('circleControlDiv').style.padding = '9px';
    this.get('circleControlDiv').style.cursor = 'pointer';
    this.get('circleControlDiv').innerHTML = '<div style="direction: ltr; overflow: hidden; text-align: left; position: relative; color: rgb(0, 0, 0); font-family: Arial, sans-serif; -webkit-user-select: none; font-size: 13px; background-color: rgb(255, 255, 255); padding: 4px; border-width: 1px 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-top-color: rgb(113, 123, 135); border-right-color: rgb(113, 123, 135); border-bottom-color: rgb(113, 123, 135); -webkit-box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; font-weight: bold; background-position: initial initial; background-repeat: initial initial; " title="Turn On/Off the Circle"><span><div style="width: 16px; height: 16px; overflow: hidden; position: relative; "><img style="position: absolute; left: 0px; top: 0px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px; width: auto; height: auto; " src="http://maps.gstatic.com/mapfiles/drawing.png" draggable="false"></div></span></div>';
    this.get('circleControlDiv').clicked = options.visible;
    var $me = this;
    // Setup the click event listeners: simply set the map to Chicago.
    google.maps.event.addDomListener(this.get('circleControlDiv'), 'click', function() {
      this.clicked = !this.clicked;
      //console.log(this.clicked);
      if(this.clicked){
        this.innerHTML = '<div style="direction: ltr; overflow: hidden; text-align: left; position: relative; color: rgb(0, 0, 0); font-family: Arial, sans-serif; -webkit-user-select: none; font-size: 13px; background-color: rgb(255, 255, 255); padding: 4px; border-width: 1px 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-top-color: rgb(113, 123, 135); border-right-color: rgb(113, 123, 135); border-bottom-color: rgb(113, 123, 135); -webkit-box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; font-weight: bold; background-position: initial initial; background-repeat: initial initial; " title="Turn On/Off the Circle"><span><div style="width: 16px; height: 16px; overflow: hidden; position: relative; "><img style="position: absolute; left: 0px; top: 0px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px; width: auto; height: auto; " src="http://maps.gstatic.com/mapfiles/drawing.png" draggable="false"></div></span></div>';
        $me.setVisible(true);
      }else{
        this.innerHTML = '<div style="direction: ltr; overflow: hidden; text-align: left; position: relative; color: rgb(51, 51, 51); font-family: Arial, sans-serif; -webkit-user-select: none; font-size: 13px; background-color: rgb(255, 255, 255); padding: 4px; border-width: 1px 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-top-color: rgb(113, 123, 135); border-right-color: rgb(113, 123, 135); border-bottom-color: rgb(113, 123, 135); -webkit-box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px; font-weight: normal; background-position: initial initial; background-repeat: initial initial; " title="Turn On/Off the Circle"><span><div style="width: 16px; height: 16px; overflow: hidden; position: relative; "><img style="position: absolute; left: 0px; top: -160px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px; width: auto; height: auto; " src="http://maps.gstatic.com/mapfiles/drawing.png" draggable="false"></div></span></div>';
        $me.setVisible(false);
      }
    });
    this.get('circleControlDiv').index = 1;
    this.get('map').controls[google.maps.ControlPosition.LEFT_TOP].push(this.get('circleControlDiv'));
  };

  /**
    * This is to extend options
    *
    * @private
    */
  InvertedCircle.prototype.extend_ = function(obj, extObj) {
    if (arguments.length > 2) {
      for (var a = 1; a < arguments.length; a++) {
        extend(obj, arguments[a]);
      }
    } else {
      for (var i in extObj) {
        obj[i] = extObj[i];
      }
    }
    return obj;
  };

  /**
    * This is draw spots
    * Thanks Sammy Hubner (http://www.linkedin.com/in/sammyhubner) for providing me these awesome code
    * @private
    */

  InvertedCircle.prototype.drawSpot_ = function(point, radius) {
    var d2r = Math.PI / 180;   // degrees to radians
    var r2d = 180 / Math.PI;   // radians to degrees
    var earthsradius = 6371;   // 6371 is the radius of the earth in kilometers
    var ret = [];
    var isNearPrimaryMeridian = false;
    var dir = 1;
    var extp = [], start, end, i, theta, ex, ey;

    var points = 128;

    // find the radius in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat() * d2r);

    if (point.lng() > 0) {
      dir = -1;
    }


    if (dir==1) {
      start=0;
      end=points+1;
    } // one extra here makes sure we connect the
    else        {
      start=points+1;
      end=0;
    }
    for (i=start; (dir==1 ? i < end : i > end); i=i+dir)
    {
      theta = Math.PI * (i / (points/2));
      ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
      ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
      if ((dir === -1 && ey < 0) || (dir === 1 && ey > 0)) {
        ey = 0;
        isNearPrimaryMeridian = true;
      }
      extp.push(new google.maps.LatLng(ex, ey));
    }
    ret.push(extp);
    // if near primary meridian we have to draw an inverse
    if (isNearPrimaryMeridian) {
      extp = [];
      dir = -dir;
      if (dir==1) {
        start=0;
        end=points+1
      } // one extra here makes sure we connect the
      else        {
        start=points+1;
        end=0
      }
      for (i=start; (dir==1 ? i < end : i > end); i=i+dir)
      {
        theta = Math.PI * (i / (points/2));
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
        if ((dir === -1 && ey < 0) || (dir === 1 && ey > 0)) {
          ey = 0;
          isNearPrimaryMeridian = true;
        }
        extp.push(new google.maps.LatLng(ex, ey));
      }
      ret.push(extp);
    }
    return ret;
  }

  /**
    * The Overlay
    * Thanks Sammy Hubner (http://www.linkedin.com/in/sammyhubner) for providing me these awesome code
    *
    */

  InvertedCircle.prototype.Overlay = function () {
    var latExtent = 86;
    var lngExtent = 180;
    var lngExtent2 = lngExtent - 1e-10;
    return [
    [
    new google.maps.LatLng(-latExtent, -lngExtent),  // left bottom
    new google.maps.LatLng(latExtent, -lngExtent),   // left top
    new google.maps.LatLng(latExtent, 0),            // right top
    new google.maps.LatLng(-latExtent, 0),           // right bottom
    ], [
    new google.maps.LatLng(-latExtent, lngExtent2),  // right bottom
    new google.maps.LatLng(latExtent, lngExtent2),   // right top
    new google.maps.LatLng(latExtent, 0),            // left top
    new google.maps.LatLng(-latExtent, 0),           // left bottom
    ]
    ];
  }

  /**
    * This is draw circle
    * Thanks Sammy Hubner (http://www.linkedin.com/in/sammyhubner) for providing me these awesome code
    * @private
    */
  InvertedCircle.prototype.drawCircle_ = function(map, center, radius){

    var paths = new this.Overlay;

    var spot = this.drawSpot_(center, radius);
    for (var i = 0; i < spot.length; i++) {
      paths.push(spot[i]);
    }

    var donut = new google.maps.Polygon({
      strokeWeight: this.stroke_weight,
      strokeColor: this.stroke_color,
      fillColor: this.fill_color,
      fillOpacity: this.fill_opacity,
      map: map
    });

    this.set('paths', paths);
    this.set('donut', donut);
    if(this.getVisible())
      this.get('donut').setPaths(paths);
  }

  // Text overlay
  function TextOverlay(cls, map, style) {
    // Now initialize all properties.
    this.pos_ = null;
    this.txt_ = null;
    this.cls_ = cls;
    this.map_ = map;
    this.style_ = style;

    // We define a property to hold the image's
    // div. We'll actually create this div
    // upon receipt of the add() method so we'll
    // leave it null for now.
    this.div_ = null;
    // Explicitly call setMap() on this overlay
    this.setMap(map);
  }

  TextOverlay.prototype = new google.maps.OverlayView();

  TextOverlay.prototype.onAdd = function() {

    // Note: an overlay's receipt of onAdd() indicates that
    // the map's panes are now available for attaching
    // the overlay to the map via the DOM.

    // Create the DIV and set some basic attributes.
    var div = document.createElement('DIV');
    div.className = this.cls_;
    div.style.cssText = this.style_;

    this.div_ = div;
    // We add an overlay to a map via one of the map's panes.

    var panes = this.getPanes();
    panes.floatPane.appendChild(div);
  }

  TextOverlay.prototype.setText = function(txt, pos) {
    this.pos = pos;
    this.txt_ = txt;
    // Set the overlay's div_ property to this DIV
    var div = this.div_;
    div.innerHTML = this.txt_;
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);

    div.style.left = position.x - 20 + 'px';
    div.style.top = position.y - 30 + 'px';
    this.show();
  }

  TextOverlay.prototype.draw = function() {
      if (!this.pos)
        return;

      var overlayProjection = this.getProjection();

      // Retrieve the southwest and northeast coordinates of this overlay
      // in latlngs and convert them to pixels coordinates.
      // We'll use these coordinates to resize the DIV.
      var position = overlayProjection.fromLatLngToDivPixel(this.pos);

      var div = this.div_;
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
  }

  //Optional: helper methods for removing and toggling the text overlay.
  TextOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }

  TextOverlay.prototype.hide = function() {
    if (this.div_) {
      this.div_.style.visibility = "hidden";
    }
  }

  TextOverlay.prototype.show = function() {
    if (this.div_) {
      this.div_.style.visibility = "visible";
    }
  }

  TextOverlay.prototype.toggle = function() {
    if (this.div_) {
      if (this.div_.style.visibility == "hidden") {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  TextOverlay.prototype.toggleDOM = function() {
    if (this.getMap()) {
      this.setMap(null);
    } else {
      this.setMap(this.map_);
    }
  }
  window.InvertedCircle = InvertedCircle;
}