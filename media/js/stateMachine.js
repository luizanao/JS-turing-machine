;(function() {

	// cores das setas
	var curColourIndex = 1, maxColourIndex = 24, nextColour = function() {
		var R,G,B;
		R = parseInt(128+Math.sin((curColourIndex*3+0)*1.3)*128);
		G = parseInt(128+Math.sin((curColourIndex*3+1)*1.3)*128);
		B = parseInt(128+Math.sin((curColourIndex*3+2)*1.3)*128);
		curColourIndex = curColourIndex + 1;
		if (curColourIndex > maxColourIndex) curColourIndex = 1;
		return "rgb(" + R + "," + G + "," + B + ")";
	 };	
	
	
		var currZoom = 1;
		    
		$(".zoomIn").click(function(){
		    currZoom+=0.5;
		    pos = $("#main").position();
		    
		    $('#main').css(
		        {
		            'zoom' : currZoom,
		            'top': pos.top - 30,
		            'z-index':'9999'

		        });
		});
		$(".zoomOff").click(function(){
		    currZoom=1;
		    $("#main").css(
		        {
		            'position' : 'relative',
		            'top' : '40px',
		            'height' : '600px',
		            'width' : '95%',
		            'zoom' : currZoom
		        });
		});
		$(".zoomOut").click(function(){
		    currZoom-=0.1;
		    $('#main').css(
		        {
		            'zoom' : currZoom,
		            'top': pos.top + 5
		        });
		});

		$(".draggable").draggable(
		{
		    containment: 'parent',
		    distance: 10
		});

	
	//set initial state as draggable 
	jsPlumb.draggable($("#initial_state"));
	
	//change label for initial state
	$('.state-label').editable(function(value, settings) { 
	         return(value);
	       },
	       { submit  : 'OK',
	});

	
	//==========================================
	//GLOBALS
	
	//custom functions for create new states
	var count_state = 0;
	
	//control of final state 
	var final_state = 0;
	
	var ok = 0;
	//==========================================

	 $('#new_state').on('click', function(){
				random_x = Math.floor(Math.random() * (30 - 15 + 1)) + 15; // posicao inicial eixo x
				random_y = Math.floor(Math.random() * (30 - 15 + 1)) + 15; // //posicao final eixo y

				//console.log("criando novo estado");
			  $('#main').append('<div class="w" id="state'+ ++count_state +'" style="top:'+ random_y+'em; left:'+ random_x +'em;"><span class="state-label">State '+ count_state +'</span><div class="ep"></div></div>');
			 	

			 	//change label for states
			 	$('.state-label').editable(function(value, settings) { 
					         return(value);
					       },
					       { submit  : 'OK',
					});


			 // setup some defaults for jsPlumb.	
				jsPlumb.importDefaults({
					Endpoint : ["Dot", {radius:4}],
					HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:2 },
					ConnectionOverlays : [
						[ "Arrow", { 
							location:1,
							id:"arrow",
		                    length:14,
		                    foldback:0.8
						} ],
		                [ "Label", { label:'connecting <img src="media/img/loader.gif"/>', id:"label" }]
					],
	        	});


			    // initialise draggable elements.  
				jsPlumb.draggable($(".w"));

	            // bind a click listener to each connection; the connection is deleted. you could of course
				// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
				// happening.
				
				jsPlumb.bind("dblclick", function(c) { 
					jsPlumb.detach(c); 
					
				});
				

				
				

				// make each ".ep" div a source and give it some parameters to work with.  here we tell it
				// to use a Continuous anchor and the StateMachine connectors, and also we give it the
				// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
				// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
				// would recommend you do. Note also here that we use the 'filter' option to tell jsPlumb
				// which parts of the element should actually respond to a drag start.
				$(".w").each(function(i,e) {			
					jsPlumb.makeSource($(e), {
						filter:".ep",
						anchor:"Continuous",
						connector:[ "StateMachine", { curviness:20 } ],
						connectorStyle:{ strokeStyle:nextColour(), lineWidth:2 },
						maxConnections:2000,
						onMaxConnections:function(info, e) {
							alert("Maximum connections (" + info.maxConnections + ") reached");
						}
					});
				});

				// bind a connection listener. note that the parameter passed to this function contains more than
				// just the new connection - see the documentation for a full list of what is included in 'info'.
				// this listener changes the paint style to some random new color and also sets the connection's internal
				// id as the label overlay's text.
				
	            jsPlumb.bind("connection", function(info) {
					info.connection.setPaintStyle({strokeStyle:nextColour()});
	                info.connection.getOverlay("label").setLabel("Add");

						$('._jsPlumb_overlay').editable(function(value, settings) { 
		         			info.connection.getOverlay("label").setLabel(value);		
		       			},
		       			{ submit  : 'OK',});
					
	            });




				// initialise all '.w' elements as connection targets.
	            jsPlumb.makeTarget($(".w"), {
					dropOptions:{ hoverClass:"dragHover" },
					anchor:"Continuous"				
				});
				
				
				$(".w").on('dblclick',function(){
					
					if (final_state ==0){
						$(this).children('.state-label').html('final state');
						$(this).css({'border': '2px solid red'});
						++final_state;
						$(this).attr('data-final', 'final_state');	
					}else{
						if (final_state==1){
							$(this).attr('data-final', 'normal');	
							$(this).css({'border': '1px solid #346789'});
							--final_state;	
						}
					}
				});

		});


	
	 $('.enjoy').on('click', function(){
	
		if (final_state==0){
				alert("Please, set a final state. (try use double click) :)");
				return;
			}

		if ($('.alphab').val().length == 0){
				alert("Please, enter a input language");
				return;
			}

			//get stirng of user
			var input = $('.alphab').val();
			
			//send input of uset to type
			for (var v=0; v< input.length; v++){
				type.push(input[v]);	
			}
		
			$('.computing_history').css('display','block');
	 	turing_processing("initial_state");
	});			

	 	

			// new type (principal) and current position ( init on # )
			var type = new Array();
			var current_position = 0;

	function turing_processing(state) {
			
			//get connection from initial state

			var init = jsPlumb.getConnections({source: state}); 
			//console.log(init);
			
			var flag_final = $('#'+state).attr("data-final");
			//console.log(flag_final);
			
			if (flag_final == 'final_state'){
				alert("Accepted!!! ")
				$('.table tr:last').after('<tr><td class="accepet" colspan="5">accepted</td>');
				
			}


			
			var transition_control = 0;
			//console.log(init.length);
			if (init.length >= 1){
				
				
				recursive: //label for recursive end

				for (var i=0;i<init.length;i++){
					
					
					var transition_value = init[i].getOverlay("label").getLabel();
					//var name_connection = init[i].id;
					
					var substring = transition_value.split('-');
					read = substring[0];
					write = substring[1];
					move = substring[2];

					// console.log('read ' + read);
					// console.log('write ' + write);
					// console.log('move ' + move);

					
					if (read == type[current_position]){
						//console.log("entrou if read");
						type[current_position] = write;
						//console.log("FITA---> " + type);
						if (move=='R') {
							//.log("entrou if R");
							current_position++;
							//console.log("posicao atual "+  current_position);
						}
						else if (move == 'L'){
							if (current_position == 0 ){
								alert("pannnn");
								return;
							}
							
							//console.log("entrou if L");
							current_position--;
							//console.log("posicao atual "+  current_position);
						}
						
						
						//================= recursive next state ==========//
						var next = init[i].targetId;
						//console.log("chando novamente --> " +  next);
						
							//update table of computer history
							$('.table tr:last').after('<tr><td>'+state+'</td><td>'+type+'</td><td>'+read+'</td><td>'+write+'</td><td>'+move+'</td></tr>');
							turing_processing(next); 
							break recursive;

						
						//================= end ==========//

					}else{
						transition_control++;
						if (transition_control >= init.length){
							$('.table tr:last').after('<tr><td class="reject" colspan="5">rejected</td>');
							alert("rejected");
						}
							
						//update table of computer history
						
					
					}//else
				}//for
			}else{

				alert("You haven't connections. Verify!");
				return;	
			}
		}//turing proccess
	
	
	
		$('#export').on('click',function(){
				
				var xmlDocument = $.parseXML("<structure/>");
				
				//set type of machine
				var tp = xmlDocument.createElement('type');
				tp.appendChild(document.createTextNode('turing'));
				xmlDocument.documentElement.appendChild(tp);
				
				//set type of machine
				var automaton = xmlDocument.createElement('automaton');
				xmlDocument.documentElement.appendChild(automaton);
				
				var id=1;

				//initial state
				var block = xmlDocument.createElement('block');
					
					
					var tag = xmlDocument.createElement('tag');
					tag.appendChild(document.createTextNode('Machine0'));
					block.appendChild(tag);
					var initial = xmlDocument.createElement('initial');
					block.appendChild(initial);
					
					automaton.appendChild(block);	
					
				$(".w").each(function() {
					
					var block = xmlDocument.createElement('block');
					//block.setAttribute('id',id);
					//block.setAttribute('name', id);
					
					var tag = xmlDocument.createElement('tag');
					tag.appendChild(document.createTextNode('Machine'+id));
					block.appendChild(tag);
					

					automaton.appendChild(block);	

					id++;
				});	

				var init = jsPlumb.getConnections();
					
				for (var d =0; d < init.length; d++){
					var transition = xmlDocument.createElement('transition');
					var cons = jsPlumb.getConnections({source: init[d].sourceId}); 
					
					for (var z=0; z < cons.length; z++){

							
							//get labels
							var transition_value = cons[z].getOverlay("label").getLabel();

							var substring = transition_value.split('-');
							read_l = substring[0];
							write_l = substring[1];
							move_l = substring[2];

							

							var from = xmlDocument.createElement('from');
							from.appendChild(document.createTextNode(init[d].sourceId));
							var to = xmlDocument.createElement('to');
							to.appendChild(document.createTextNode(init[d].targetId));

							var read = xmlDocument.createElement('read');
							read.appendChild(document.createTextNode(read_l));
							
							var writed = xmlDocument.createElement('write');
							writed.appendChild(document.createTextNode(write_l));
							
							var move = xmlDocument.createElement('move');
							move.appendChild(document.createTextNode(move_l));
							
							transition.appendChild(from);
							transition.appendChild(to);
							transition.appendChild(read);
							transition.appendChild(writed);
							transition.appendChild(move);
							
							automaton.appendChild(transition);	
					}
				}
				
				id=0;
				$(".w").each(function() {
					
					var machine = xmlDocument.createElement('Machine'+id);
					automaton.appendChild(machine);
					id++;
				});	


				//var teste = (new XMLSerializer()).serializeToString(xmlDocument);
				//$.get('download.php?field_xml='+teste);
				
				var new_xml = (new XMLSerializer()).serializeToString(xmlDocument);
				$.post('download.php', { field_xml: new_xml });
				

				console.log(xmlDocument);
		});

})(); //endfile



