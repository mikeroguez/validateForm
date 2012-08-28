(function( $ ) {

	var $options;
	
	var $methods = {
	
		init : function( options ){
			
			return this.each(function(){
			
				$this = $(this);
				$options = $.extend({
					settings: {
						errorClasses: 'error',
						useErrorDiv: true,
						errorDivId: 'errorDiv',
						bootstrapCss: true,
						errorMsg: 'Error in field ',
						requiredMsg: 'required'
					},
					rules: {
						text : { json : /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9]+$/, message : 'Only text is allowed'},
						alfanumeric : { json : /[0-9a-zA-Z]/, message : 'Only alphanumeric values are allowed'},
						numeric : { json : /^-?\d+(?:\.\d{0,3})?$/, message : 'Only numbers are allowed'},
						email : { json : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message : 'Enter a valid email'},
						dateISO: { json : /^(20|21)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/, message : 'Enter a valid date YYYY-MM-DD' },
						dateMX: {json : /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](20|21)\d\d$/, message : 'Enter a valid date DD-MM-YYYY'}					
					},
					specialCases: {
					}
				}, options);			
				
				$this.bind('submit', function(){ return $this.validateForm('validate') } );
				$this.find('input, textarea, select').bind('keyup', function(){ 
					if( validateObject($(this)) ){
						clearError($(this))
					}
				})
			});
			
		},
		
		destroy: function(){
			return this.each(function(){
				this.unbind('submit');
			});			
		},
		
		validate: function(){
			$valida = true;
			$form = this;
			clearErrors($form);	
			$form.find('input, textarea, select').each( 
				function(){
					$valida &= validateObject($(this));
				}
			);
			return ($valida) ? true : false;			
		}
		
	}
	
	function clearErrors(form){
		if( $options.settings.useErrorDiv ){
			$("#"+$options.settings.errorDivId).html("");
			$("#"+$options.settings.errorDivId).css("display", "none");
		}

		form.find('input, textarea, select').each( 
			function(){
				clearError ($(this));
			}
		);	
	}

	function clearError(object) {
		object.parent().removeClass( $options.settings.errorClasses );
		if( $options.settings.bootstrapCss ){
			object.parent().removeClass( $options.settings.errorClasses );
		}else{
			object.removeClass( $options.settings.errorClasses );
		}	
	}
	
	function printError(object, message){
		if( $options.settings.useErrorDiv ){
			$("#"+$options.settings.errorDivId).append(message + "<br/>");
			$("#"+$options.settings.errorDivId).css("display", "block");
		}
		
		if( $options.settings.bootstrapCss ){
			object.parent().addClass($options.settings.errorClasses);
		}else{
			object.addClass($options.settings.errorClasses);
		}
	}

	function validateObject($object){
		$valida = true;
		clase = ($object.attr('class') != undefined ) ? $object.attr('class') : "";
		if(clase.charAt(0)=="{"){
		
			if(clase.indexOf('}') == -1){
				$.error( 'Error on validation rule on a field [jQuery.validateForm]' );
				return false;
			}else{
				ObjRules = clase.substring(0, clase.indexOf('}')+1);
			}
			eval('$ObjRules='+ObjRules);
			
			if( $object.is("textarea") || $object.is(":text")){
				$required = ($ObjRules.required === undefined) ? 'false' : $ObjRules.required;
				
				if( $required == 'true' || ( $required != 'true' && $object.val() != "" )){
					
					if( $options.rules[$ObjRules.type] !== undefined ){
						if( !$object.val().match( ( $ObjRules.type !== undefined ) ? $options.rules[$ObjRules.type].json : "" ) ){
						/* = Checa contra las reglas $rules = */
							$valida &= false;
							printError($object, $options.settings.errorMsg + $ObjRules.name + ": '" + $options.rules[$ObjRules.type].message + "'");
						}
					}
					
					if( $required == 'true' && $object.val() == ""){
					/* = Checa si es requerido que no esté vacío = */
						$valida &= false;
						printError($object, $options.settings.errorMsg + $ObjRules.name + ": '"+$options.settings.requiredMsg+"'");
					}

				}
			}

			if( $ObjRules.specialCase !== undefined ){
				if( $options.specialCases[$ObjRules.specialCase] !== undefined ){
					result = $options.specialCases[$ObjRules.specialCase].funcion( $object )
					if( !result ) printError($object, $options.settings.errorMsg + $ObjRules.name + ": '" + $options.specialCases[$ObjRules.specialCase].message + "'");
					$valida &= result
				}
			}
			
		}
		return ($valida) ? true : false;
	}
	
	$.fn.validateForm = function( method ) {
		if( $methods[method] ){
			return $methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}else if( typeof method === 'object' || ! method ){
			return $methods.init.apply( this, arguments );
		}else{
			$.error( 'Method ' + method + ' does not exist on jQuery.validateForm' );
		}
	};

})( jQuery );