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
						errorMsg: 'Error en el campo ',
						requiredMsg: 'required'
					},
					rules: {
						text : { json : /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9]+$/, message : 'Introduzca solo texto'},
						alfanumeric : { json : /[0-9a-zA-Z]/, message : 'Introduzca valores autonuméricos'},
						numeric : { json : /^-?\d+(?:\.\d{0,3})?$/, message : 'Introduzca solo n&uacute;meros'},
						email : { json : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message : 'Introduzca un correo v&aacute;lido'}					
					},
					specialCases: {
					}
				}, options);			
				
				$this.bind('submit', function(){ return $this.validateForm('validate') } );
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
					clase = ($(this).attr('class') != undefined ) ? $(this).attr('class') : "";
					if(clase.charAt(0)=="{"){
					
						if(clase.indexOf('}') == -1){
							$.error( 'Error on validation rule on a field [jQuery.validateForm]' );
							return false;
						}else{
							ObjRules = clase.substring(0, clase.indexOf('}')+1);
						}
						eval('$ObjRules='+ObjRules);
						
						if( $(this).is("textarea") || $(this).is(":text")){
							$required = ($ObjRules.required === undefined) ? 'false' : $ObjRules.required;
							
							if( $required == 'true' || ( $required != 'true' && $(this).val() != "" )){
								
								if( $options.rules[$ObjRules.type] !== undefined ){
									if( !$(this).val().match( ( $ObjRules.type !== undefined ) ? $options.rules[$ObjRules.type].json : "" ) ){
									/* = Checa contra las reglas $rules = */
										$valida &= false;
										printError($(this), $options.settings.errorMsg + $ObjRules.name + ": '" + $options.rules[$ObjRules.type].message + "'");
									}
								}
								
								if( $required == 'true' && $(this).val() == ""){
								/* = Checa si es requerido que no esté vacío = */
									$valida &= false;
									printError($(this), $options.settings.errorMsg + $ObjRules.name + ": '"+$options.settings.requiredMsg+"'");
								}

							}
						}

						if( $ObjRules.specialCase !== undefined ){
							if( $options.specialCases[$ObjRules.specialCase] !== undefined ){
								result = $options.specialCases[$ObjRules.specialCase].funcion( $(this) )
								if( !result ) printError($(this), $options.settings.errorMsg + $ObjRules.name + ": '" + $options.specialCases[$ObjRules.specialCase].message + "'");
								$valida &= result
							}
						}
						
					}
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
				$(this).parent().removeClass( $options.settings.errorClasses );
				if( $options.settings.bootstrapCss ){
					$(this).parent().removeClass( $options.settings.errorClasses );
				}else{
					$(this).removeClass( $options.settings.errorClasses );
				}				
			}
		);	
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