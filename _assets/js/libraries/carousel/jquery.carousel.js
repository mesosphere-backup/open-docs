;(function ($, window, document, undefined) {
    
    var pluginName = 'carousel';
    var defaults = {
			
			speed							:	5000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	null,
			navigation_option_next			:	null,
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	null
			
		};
		
    function Plugin(element, options) {
    	
        this.element = element;
        
        this.options = $.extend({}, defaults, options);
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
        
    }
    
    $.fn[pluginName] = function (options) {
    	
        return this.each(function () {
        	
            if (!$.data(this, 'plugin_' + pluginName)) {
            	
                $.data(this, 'plugin_' + pluginName, 
                new Plugin($(this), options));
                
            }
            
        });
        
    }
    
	Plugin.prototype.init = function () {
    	
    	// Define and Initialize Variables
		
		this.carousel_children = [];
		this.carousel_slides = [];
		this.carousel_slides_count = 0;
		this.carousel_slides_index_active = 0;
		this.carousel_slides_index_previous = 0;
		this.carousel_slides_direction;
		this.carousel_pagination_items = [];
		this.carousel_clock;
		
		if (this.options.child_selector == null) {
		    
			this.carousel_children = this.element.children();
		    
		} else {
			
		    this.carousel_children = this.element.find(this.options.child_selector);
		    
		}
		
		var self = this;
		
		this.carousel_children.each(function(e) {
			
		    if(!$(this).hasClass('static')) {
				
				self.carousel_slides.push($(this));
		    	
		        self.carousel_slide_animate_out(self.carousel_slides_count);
				
				$(this).find('input').focus(function() {
					
					self.carousel_clock_stop();
					
				}).blur(function() {
					
					self.carousel_clock_start();
					
				});
				
				$(this).data("slide-index", self.carousel_slides_count);
				
				if (self.options.pagination_navigation == true) {
					
					$(this).click(function () {
						
						self.carousel_slide_animate_to($(this).data("slide-index"));
		            	
		            });
			        
				}
			       
				self.carousel_slides_count++;
				
			}
			
		});
		
		// If there is only 1 slide, cancel animation
		
		if(this.carousel_slides.length == 1) {
			
			return false;
			
		}
		
		// If navigation_option_previous trigger set
		
		if(this.options.navigation_option_previous != null) {
		    
		    this.options.navigation_option_previous.click(function (e) {
				
				e.preventDefault();
				
				self.carousel_slide_animate_direction("prev");
		    	
		    });
		    
		}
		
		// If navigation_option_previous trigger set
		
		if (this.options.navigation_option_next != null) {
		    
		    this.options.navigation_option_next.click(function (e) {
				
				e.preventDefault();
				
				self.carousel_slide_animate_direction("next");
		    	
		    });
		    
		}
		
		// If Pagination
		
		if (this.options.pagination == true) {
			
			var pagination = $("<ul class='carousel-pagination'></ul>");
			
			pagination.appendTo(this.element);
			
			for (var i = 0; i < this.carousel_slides.length; i++) {
				
		    	var pagination_item = $("<li><a href='' data-slide-index='" + i + "'><span>" + i + "</span></a></li>");
		    	
		    	pagination_item.appendTo(pagination);
		    	
		    	pagination_item.find('a').click(function(e) {
		        	
		        	e.preventDefault();
		        	
		        	self.carousel_slide_animate_to(this.getAttribute("data-slide-index"));
		        	
		    	});
		    	
		    	this.carousel_pagination_items.push(pagination_item);
		    	
			}
			
		}
		
		// Set initial front photo z-index and fades it in
		
		this.carousel_slide_animate_in(this.carousel_slides_index_active);
			
		this.options.slide_animate_callback(this.carousel_slides[this.carousel_slides_index_active]);
		
		this.carousel_clock_start();
    	
    };
    
    /* ------------------------------------------------------- */
    /* Start Clock                                             */
    /* ------------------------------------------------------- */
	
    Plugin.prototype.carousel_clock_start = function() {
		
		var self = this;
		
		this.carousel_clock = setInterval(function(e) {
			
			self.carousel_slide_animate_direction("next"); 
			
		}, this.options.speed);
		
	};
    
    /* ------------------------------------------------------- */
    /* Stop Clock                                              */
    /* ------------------------------------------------------- */
	
    Plugin.prototype.carousel_clock_stop = function() {
    	
		clearInterval(this.carousel_clock);
		
    };
    
    /* ------------------------------------------------------- */
    /* Animate In Sequence                                     */
    /* ------------------------------------------------------- */
    
    Plugin.prototype.carousel_slide_animate_in = function(index) {
		
        this.carousel_slides[index].removeClass(this.options.class_inactive);
        this.carousel_slides[index].addClass(this.options.class_active);
		
        this.carousel_slide_update_neighbors();
        
        if(this.carousel_pagination_items[index]) {
        	
        	this.carousel_pagination_items[index].addClass(this.options.class_active);
        	
        }
        
    };
    
    /* ------------------------------------------------------- */
    /* Animate Out Sequence                                    */
    /* ------------------------------------------------------- */
    
    Plugin.prototype.carousel_slide_animate_out = function(index) {
        
        this.carousel_slides[index].removeClass(this.options.class_active);
        this.carousel_slides[index].addClass(this.options.class_inactive);
        
        if(this.carousel_pagination_items[index]) {
        	
        	this.carousel_pagination_items[index].removeClass(this.options.class_active);
        	
        }
        
    };
    
    /* ------------------------------------------------------- */
    /* Animate                                                 */
    /* ------------------------------------------------------- */
    
    Plugin.prototype.carousel_slide_animate_to = function(index) {
		
		this.carousel_clock_stop();
		
		// If there is only 1 slide, cancel animation
		
		if(this.carousel_slides.length == "1") {
			
			return false;
			
		}
		
		// Store the previously this.carousel_slides_index_active
		
		this.carousel_slides_index_previous = this.carousel_slides_index_active;
		this.carousel_slides_index_active = index;
		
		// Animate out previousSlide
		
		this.carousel_slide_animate_out(this.carousel_slides_index_previous);
		
		// Animate in this.carousel_slides_index_active
		
		this.carousel_slide_animate_in(this.carousel_slides_index_active);
		
		this.options.slide_animate_callback(this.carousel_slides[this.carousel_slides_index_active]);
		
		this.carousel_clock_start();
		
	};
    
    /* ------------------------------------------------------- */
    /* Update Neighbors                                        */
    /* ------------------------------------------------------- */
    
    Plugin.prototype.carousel_slide_update_neighbors = function() {
		
		this.carousel_slides_neighbor_count_before = Math.floor((this.carousel_slides_count - 1) / 2);
		this.carousel_slides_neighbor_count_after = Math.ceil((this.carousel_slides_count - 1) / 2);
		
		var regex_before = new RegExp('\\b' + 'before-' + '.+?\\b', 'g');
		var regex_after = new RegExp('\\b' + 'after-' + '.+?\\b', 'g');
		
		for (var i = 0; i < this.carousel_slides_count; i++) {
			
			var new_class = "";
			
			if (i < this.carousel_slides_index_active) {
				
				var offset = (this.carousel_slides_index_active - i);
				
				if (offset <= this.carousel_slides_neighbor_count_before) {
					
					new_class = "before-" + offset;
					
				} else {
					
					var offset_temp = this.carousel_slides_neighbor_count_after - (offset - this.carousel_slides_neighbor_count_before - 1);
					new_class = "after-" + offset_temp;
					
				}
				
			} else if (i > this.carousel_slides_index_active) {
				
				var offset = -1 * (this.carousel_slides_index_active - i);
				
				if (offset <= this.carousel_slides_neighbor_count_after) {
					
					new_class = "after-" + offset;
					
				} else {
					
					var offset_temp = this.carousel_slides_neighbor_count_before - (offset - this.carousel_slides_neighbor_count_after - 1);
					new_class = "before-" + offset_temp;
					
				}
				
			} else {
				
			}
			
			this.carousel_slides[i][0].className = this.carousel_slides[i][0].className.replace(regex_before, '');
			this.carousel_slides[i][0].className = this.carousel_slides[i][0].className.replace(regex_after, '');
			this.carousel_slides[i].addClass(new_class);
			
		}
		
	};
    
    /* ------------------------------------------------------- */
    /* Animate                                                 */
    /* ------------------------------------------------------- */
    
    Plugin.prototype.carousel_slide_animate_direction = function(direction) {
		
		this.carousel_clock_stop();
		
		// Store the previously this.carousel_slides_index_active
		
		this.carousel_slides_index_previous = this.carousel_slides_index_active;
		this.carousel_slides_direction = direction;
		
		// If there is only 1 slide, cancel animation
		
		if(this.carousel_slides.length == "1") {
			
			return false;
			
		}					
			
		// Determine the activeImage
		
		if(direction == "next") {
			
			this.carousel_slides_index_active++
			
			if(this.carousel_slides_index_active == this.carousel_slides_count) {
				
				this.carousel_slides_index_active = 0;
				
			}
			
		} else if(direction == "prev") {
			
			this.carousel_slides_index_active--
			
			if(this.carousel_slides_index_active < 0) {
				
				this.carousel_slides_index_active = this.carousel_slides_count - 1;
				
			}
			
		} else {
			
			this.carousel_slides_index_active = direction;
			
			if (this.carousel_slides_index_previous < this.carousel_slides_index_active) { 
				
				this.carousel_slides_direction = "next";
				
			} else if (this.carousel_slides_index_previous > this.carousel_slides_index_active) { 
				
				this.carousel_slides_direction = "prev"
				
			}
			
		}
		
		// Animate out previousSlide
		
		this.carousel_slide_animate_out(this.carousel_slides_index_previous);
		
		// Animate in this.carousel_slides_index_active
		
		this.carousel_slide_animate_in(this.carousel_slides_index_active);
		
		this.options.slide_animate_callback(this.carousel_slides[this.carousel_slides_index_active]);
		
		this.carousel_clock_start();
		
	};
	
})(jQuery, window, document);