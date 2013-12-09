var UI_CONSTANTS = (function ($) {
	var constants = {};
	// General Constants 
	constants.defaultUILanguage = 'en';
	constants.avatarServiceURL = "http://en.gravatar.com/";
	constants.FMServerURL = "rtmp://qww7c0.live.cloud.influxis.com/qww7c0/_definst_/";
	constants.trDescriptionPayPalCompleted = "PayPalCompleted";
	constants.trDescriptionPayPalPending = "PayPalPending";
	constants.refreshParticipantsInterval = 3000;
	
	constants.fnTextCodesHandeler = function(sTextCode, aParameters){// part of the UI lib...
		if(aParameters.length >= 1){
			aParameters.unshift(sTextCode); //add element to the beginning of the array
			return jQuery.i18n.prop.apply(undefined, aParameters); //apply can call function with dynamic array of parameters
		}
		else{
			return jQuery.i18n.prop(sTextCode);
		}
		
	};
	constants.defaultNotificationMessageDuration = 5000;
	return constants;
}(jQuery));
var cBasicControl = Class.create();
cBasicControl.prototype = {
	
	basicInitialize: function(id, obj) {
		this.id = id;		
		this.styleClasses = [];
	},
	initialize: function() {},
	
	render: function(){},
	
	destroy: function(){
		$("#" + this.id).remove();
		$("#" + this.id).unbind();			
	},
	
	placeAt: function(sDomElement){
		this._onBeforeRendering(this);		
		var sHtml = this.render();
		$($("#" + sDomElement)[0]).append(sHtml);
		this._onAfterRendering(this);	
	},
	
	rerender: function(bWithoutOnBeforeRendering, bWithoutOnAfterRendering){
		if(!bWithoutOnBeforeRendering){
			this._onBeforeRendering(this);			
		}
		
		var sHtml = this.render();
		var index = $($("#" + this.id).parent()[0]).children().index($("#" + this.id));
		$($($("#" + this.id).parent()[0]).children()[index]).after(sHtml);
		this.destroy();//I guess here also recursion is needed for the children...

		if(!bWithoutOnAfterRendering){
			this._onAfterRendering(this);			
		}		
	},
	
	addStyleClass: function(sClassName, bNotRerender){
		this.removeStyleClass(sClassName, true);//to prevent duplicated classes 
		this.styleClasses.push(sClassName);
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();
		}
	},	
	
	removeStyleClass: function(sClassName, bNotRerender){
		for(var i = 0; i < this.styleClasses.length; i++){
			if(this.styleClasses[i] == sClassName){
				this.styleClasses.splice(i, 1);
				break;				
			}
		}
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();
		}		
	},	
	
	hasStyleClass: function(sClassName){
		for(var i = 0; i < this.styleClasses.length; i++){
			if(this.styleClasses[i] == sClassName){
				return true;
			}
		}	
		return false;
	},
	
	onBeforeRendering: function(){},
	
	_onBeforeRendering: function(obj){
		obj.onBeforeRendering();
		if(obj && obj.content && obj.content.length){
			for(var i = 0; i < obj.content.length; i++){
				obj.content[i]._onBeforeRendering(obj.content[i]);
			}
		}		
	},
	
	onAfterRendering: function(obj){},

	_onAfterRendering: function(obj){
		obj.onAfterRendering(obj);			

		this.onContentAfterRendering(obj);
		
		this.onFinalAfterRendering(obj);
	},	
	
	onContentAfterRendering: function(obj){
		if(obj && obj.content && obj.content.length){
			for(var i = 0; i < obj.content.length; i++){
				obj.content[i]._onAfterRendering(obj.content[i]);
			}
		}		
	},
	
	onFinalAfterRendering: function(obj){
		
	},
	
	addContent: function(aContentItems){
		for(var i = 0; i < aContentItems.length; i++){
			this.content.push(aContentItems[i]);
		}
	},
	
	removeContent: function(obj){
		for(var i = 0; i < obj.content.length; i++){
			if(obj.content[i].content && obj.content[i].length > 0){
				obj.removeContent(obj.content[i]);
			}
		}
		while(obj.content.length){
			obj.content.splice(0, 1);
		}		
	},	
	
	getId: function(){
		return this.id;
	},
	
	translate: function(obj){
        if(!obj || !obj.content){
            return;     
         }  		
		for(var i = 0; i < obj.content.length; i++){
			if(obj.content[i].content && obj.content[i].content.length > 0){
				obj.content[i].translate(obj.content[i]);
			}
		}
		for(var i = 0; i < obj.content.length; i++){
			obj.content[i].translate();
		}
	}
};
var cAudioControl = Class.create();
cAudioControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.src){
			this.src = obj.src;
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<audio id = \"" + this.getId() + "\" class=\"audioControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		sHtml = sHtml + "<source src=" + this.getSrc() + "></source>"
		sHtml = sHtml + "</audio>"; 
		return sHtml;		
	},
	
	getSrc: function(){
		return this.src;
	},
	
	setSrc: function(sSrc){
		this.src = sSrc;
		this.rerender();		
	},	
});
var cButtonControl = Class.create();
cButtonControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.text){
			this.text = obj.text;
		}
		if(obj && obj.disabled){
			this.disabled = true;
		}
		else{
			this.disabled = false;
		}
		this.textCode = "";
		if(obj && obj.textCode){
			this.textCode = obj.textCode;
		}	
		this.textCodeParameters = [];
		if(obj && obj.textCodeParameters){
			this.textCodeParameters = obj.textCodeParameters;
		}		
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<button id = " + this.id + " class=\"buttonControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}
		sHtml = sHtml + "\"";
		if(this.disabled){
			sHtml = sHtml + " disabled";
		}
		sHtml = sHtml + ">";
		if(this.getTextCode() !== ""){
			var aClone = this.textCodeParameters.slice(0);// copy of the array...
			sHtml = sHtml + UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else
		{
			sHtml = sHtml + this.getText();
		}		

		sHtml = sHtml + "</button>"; 
		return sHtml;		
	},
	
	getText: function(){
		if(this.getTextCode() !== ""){
			var aClone = this.textCodeParameters.slice(0);
			return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else{
			return this.text;
		}
	},
	
	setText: function(sText, bNotRerender){
		this.text = sText;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
	
	getDisabled: function(){
		return this.disabled;
	},
	
	setDisabled: function(bValue, bNotRerender){
		this.disabled = bValue;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},
	
	getTextCode: function(){
		return this.textCode;
	},
	
	setTextCode: function(sTextCode, bNotRerender){
		this.textCode = sTextCode;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},		

	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).unbind();//to clear all bindings first...
			$("#" + that.id).bind('click', obj, function(){
				fnEventHandler(obj);
			});
		};
	},
	
	translate: function(){
		this.setTextCode(this.getTextCode());
	}	

});
var cCheckBoxControl = Class.create();
cCheckBoxControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj){
			if(obj.label){
				this.label = obj.label;				
			}
			if(obj.name){
				this.name = obj.name;				
			}
			if(obj.checked){
				this.checked = obj.checked;				
			}		
			if(obj.disabled){
				this.disabled = obj.disabled;				
			}				
		}
	},
	
	setLabel: function(sValue){
		this.label = sValue;
		this.rerender();		
	},
	
	getLabel: function(){
		return this.label;		
	},
	
	setName: function(sValue){
		this.name = sValue;
		this.rerender();		
	},
	
	getName: function(){
		return this.name;		
	},	
	
	setChecked: function(bValue){
		this.checked = bValue;
		this.rerender();
	},	
	
	setDisabled: function(bValue){
		this.disabled = bValue;
		this.rerender();
	},
	
	getChecked: function(){
		return this.checked;
	},
	
	getDisabled: function(){
		return this.disabled;
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<div id=" + this.getId() + " class=\"checkBoxControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}			
		sHtml = sHtml + "\">";
		sHtml = sHtml + " <input id=" + this.getId() + "Content" + " type=checkbox name=" + this.getName();
		if(this.getChecked()){
			sHtml = sHtml + " checked=checked";
		}
		if(this.getDisabled()){
			sHtml = sHtml + " disabled=disabled";
		}		
		sHtml = sHtml + ">" + "<span>" + this.getLabel() + "</span>";
		sHtml = sHtml + "</div>";
		return sHtml;		
	},
	
	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.getId() + "Content").bind('click', that, function(){
				fnEventHandler(that);
			});
		};
	},
});


var cDropDownBoxControl = Class.create();
cDropDownBoxControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj.value){
			this.value = obj.value;				
		}
		if(obj.items){
			this.items = obj.items;
		}
		else{
			this.items = [];
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<select id = \"" + this.getId() + "\" class=\"dropDownBoxControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		for(var i = 0; i < this.items.length; i++){
			sHtml = sHtml + "<option value=\"" + this.items[i].getText() + "\">" + this.items[i].getText() + "</option>";
		}
		sHtml = sHtml + "</select>"; 
		return sHtml;		
	},
	
	getValue: function(){
		return this.value;
	},
	
	setValue: function(sValue, bNotRerender){
		this.value = sValue;
		if(bNotRerender === false || bNotRerender === undefined){
			//this.rerender();
			$("#" + this.getId()).val(sValue);
		}		
	},	
	
	onAfterRendering: function(obj){
		if(obj){
			$("#" + obj.getId()).bind('change', obj, function(oEvent){
				oEvent.data.setValue($("#" + obj.getId()).val(), true);
			});				
		}
		else{
			var that = this;
			$("#" + this.getId()).bind('change', this, function(oEvent){
				oEvent.data.setValue($("#" + that.getId()).val(), true);
			});	
		}		
	},
	
//	onChange: function(obj, fnEventHandler){
//		var that = this;
//		var fnOnAfterRendering = this.onAfterRendering;
//		this.onAfterRendering = function(){
//			fnOnAfterRendering(that);
//			$("#" + that.id).bind('change', obj, function(){
//				fnEventHandler(obj);
//			});
//		};
//	}	
});
var cHorizontalLayoutControl = Class.create();
cHorizontalLayoutControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.content){
			this.content = obj.content;
		}
		else{
			this.content = [];
		}
		this.contentItemStyleClass = "horizontalLayoutItem";
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<table id=" + this.id + " class=\"horizontalLayoutControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		sHtml = sHtml + "<tr>"; 
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + "<td class=\"horizontalLayoutControlContentItem\">";
			sHtml = sHtml + this.content[i].render();
			sHtml = sHtml + "</td>";
		}		
		sHtml = sHtml + "</tr>"; 
		sHtml = sHtml + "</table>"; 
		return sHtml;		
	},	
	
	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).unbind();//to clear all bindings first...
			$("#" + that.id).bind('click', obj, function(){
				fnEventHandler(obj);
			});
		};
	},	

});
var cHtmlControl = Class.create();
cHtmlControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.html){
			this.html = obj.html;
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<div id = \"" + this.getId() + "\" class=\"htmlControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		if(this.getHtml()){
			sHtml = sHtml + this.getHtml();
		}
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	getHtml: function(){
		return this.html;
	},
	
	setHtml: function(sHtml){
		this.html = sHtml;
		this.rerender();		
	},	
});
var cHtmlEditorControl = Class.create();
cHtmlEditorControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.html = "";
		if(obj && obj.html){
			this.setHtml(obj.html, true);
		}
		this.editable = false;
		if(obj && obj.editable){
			this.setEditable(obj.editable, true);
		}
		this.addStyleClass("clear", true);
	},
	
	render: function(){
		var sHtml = "";
		
		sHtml = sHtml + "<div id = \"" + this.getId() + "\" class=\"htmlEditorControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		
		sHtml = sHtml + "<div id = \"" + this.getId() + "Toolbar" + "\" class=\"htmlEditorControlToolbar\"> </div>";
		sHtml = sHtml + "<div id = \"" + this.getId() + "Editor" + "\" class=\"htmlEditorControlEditor\">";
		
		if(this.getHtml()){
			sHtml = sHtml + this.getHtml();
		}
		sHtml = sHtml + "</div>";
		
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	onAfterRendering: function(obj){
        $('#' + this.getId() + "Editor").freshereditor({toolbar_selector: "#" + this.getId() + "Toolbar", excludes: ['removeFormat', 'insertheading4']});
        $('#' + this.getId() + "Editor").freshereditor("edit", this.getEditable());
        if(!this.getEditable){
        	$('#' + this.getId() + "Toolbar" ).css("dislay, none");
        }
        else{
        	$('#' + this.getId() + "Toolbar").css("dislay, block");
        }
        
		if(obj){
			$("#" + obj.getId() + "Editor").bind('blur', obj, function(oEvent){
				oEvent.data.setHtml($("#" + obj.getId() + "Editor").html(), true);
			});				
		}
		else{
			var that = this;
			$("#" + this.getId() + "Editor").bind('blur', this, function(oEvent){
				oEvent.data.setHtml($("#" + that.getId() + "Editor").html(), true);
			});	
		}        
	},
	
	getHtml: function(){
		return this.html;
	},
	
	getHtmlContent: function(){
		return $('#' + this.getId() + "Editor").html();
	},
	
	setHtml: function(sHtml, bNotRerender){
		this.html = sHtml;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
	
	getEditable: function(){
		return this.editable;
	},
	
	setEditable: function(bValue, bNotRerender){
		this.editable = bValue;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
});
var cImageControl = Class.create();
cImageControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.url = "";
		if(obj && obj.url){
			this.url = obj.url;
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<span id=" + this.getId() +"Wrapper >";
		sHtml = sHtml + "<img id='" + this.getId() + "' src='" + this.getUrl() + "' class=\"imageControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";		
		sHtml = sHtml + "</span>";
		return sHtml;		
	},
	
	getUrl: function(){
		return this.url;
	},
	
	refresh: function(sUrl){
		$( "#" + this.getId() ).attr( "src", this.getUrl() );
	},
	
	setUrl: function(sUrl){
		this.url = sUrl;
		if (this.url !== "") this.refresh();
	},	

	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).unbind();//to clear all bindings first...
			$("#" + that.id).bind('click', obj, function(){
				fnEventHandler(obj);
			});
		};
	},	
	
});
var cInputFieldControl = Class.create();
cInputFieldControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj.type){
			this.type = obj.type;
		}
		if(obj.readonly){
			this.readonly = obj.readonly;
		}
		else{
			this.readonly = false;
		}
		if(obj.value){
			this.value = obj.value;
		}
		else{
			this.value = "";
		}
		if(obj.spellcheck){
			this.spellcheck = obj.spellcheck;
		}
		else{
			this.spellcheck = false;
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<input id=" + this.id + " type=" + this.type + " class=\"inputFieldControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		if(this.getValue()){
			sHtml = sHtml + "\" value=\"" + this.getValue();
		}
		sHtml = sHtml + "\"";
		if(this.getReadonly()){
			sHtml = sHtml + " readonly=redonly";
		}	
		sHtml = sHtml + " spellcheck=" + this.spellcheck + ">";
		
		return sHtml;		
	},

	setReadonly: function(bValue, bNotRerender){
		this.readonly = bValue;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}	
	},
	
	getReadonly: function(){
		return this.readonly;
	},
	
	setValue: function(sValue, bNotRerender){
		this.value = sValue; //toUnicode(sValue);
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}
	},
	
	getValue: function(){
		return this.value;
	},
	
	getType: function(){
		return this.type;
	},
	
	onAfterRendering: function(obj){
		if(obj){
			$("#" + obj.getId()).bind('blur', obj, function(oEvent){
				oEvent.data.setValue($("#" + obj.getId()).val(), true);
			});				
		}
		else{
			var that = this;
			$("#" + this.getId()).bind('blur', this, function(oEvent){
				oEvent.data.setValue($("#" + that.getId()).val(), true);
			});	
		}
	},
	
	onKeyUp: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).bind('keyup', obj, function(event){
				event.data.setValue($("#" + obj.getId()).val(), true);
				fnEventHandler(obj, event);
			});
		};
	},		
	
	setFocus: function(){
		$('#' + this.getId()).focus();
	},
	
});
var cLabelControl = Class.create();
cLabelControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.text = "";
		if(obj && obj.text){
			//this.text = obj.text;
			this.setText(obj.text);
		}
		this.backgroundImg = "";	
		if(obj && obj.backgroundImg){
			this.backgroundImg = obj.backgroundImg;
		}
		this.textCode = "";
		if(obj && obj.textCode){
			this.textCode = obj.textCode;
		}	
		this.textCodeParameters = [];
		if(obj && obj.textCodeParameters){
			this.textCodeParameters = obj.textCodeParameters;
		}			
	},
	
	render: function(){
		var sHtml = "";
		
		sHtml = sHtml + "<span";
		
		if(this.getId()){
			sHtml = sHtml + " id = \"" + this.getId() + "\"";
		}
		
		sHtml = sHtml + " class=\"labelControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		if(this.getTextCode() !== ""){
			var aClone = [];
			if(this.textCodeParameters){
				aClone = this.textCodeParameters.slice(0);// copy of the array...
			}
			sHtml = sHtml + UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else
		{
			sHtml = sHtml + this.getText();
		}
		sHtml = sHtml + "</span>"; 
		return sHtml;		
	},
	
	getText: function(){
		if(this.getTextCode() !== ""){
			var aClone = this.textCodeParameters.slice(0);
			return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else{
			return this.text;
		}
	},
	
	setText: function(sText, bNotRerender){
		this.text = htmlEncode(sText);//toUnicode(sText);
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},
	
	getTextCodeParameters: function(){
		return this.textCodeParameters;
	},
	
	setTextCodeParameters: function(aTextCodeParameters, bNotRerender){
		this.textCodeParameters = aTextCodeParameters;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
	
	getTextCode: function(){
		return this.textCode;
	},
	
	setTextCode: function(sTextCode, bNotRerender){
		this.textCode = sTextCode;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
	
	getBackgroundImg: function(){
		return this.backgroundImg;
	},
	
	setBackgroundImg: function(sValue){
		this.backgroundImg = sValue;
		this.rerender();		
	},	
	
	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).unbind();//to clear all bindings first...
			$("#" + that.id).bind('click', obj, function(){
				fnEventHandler(obj);
			});
		};
	},
	
	onAfterRendering: function(obj){
		if(obj.getBackgroundImg() !== "" && obj.getBackgroundImg() !== undefined){
			$("#" + obj.getId()).css('background-image', "url(\"" + obj.getBackgroundImg() + "\")");
			$("#" + obj.getId()).css('background-repeat', "no-repeat");
			$("#" + obj.getId()).css('background-size', "cover");
		}
	},
	
	translate: function(){
		this.setTextCode(this.getTextCode());
	}
});
var cNotificationMessageControl = Class.create();
cNotificationMessageControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.type = "S";
		if(obj && obj.type){
			this.setType(obj.type);
		}
		this.text = "";
		if(obj && obj.text){
			this.setText(obj.text);
		}		
		this.textCode = "";
		if(obj && obj.textCode){
			this.textCode = obj.textCode;
		}	
		this.textCodeParameters = [];
		if(obj && obj.textCodeParameters){
			this.textCodeParameters = obj.textCodeParameters;
		}	
		
		this.duration = UI_CONSTANTS.defaultNotificationMessageDuration;
		if(obj && obj.duration){
			this.duration = obj.duration;
		}		
		
		switch (this.type){
			case "E":
				this.addStyleClass("notificationErrorMessage", true);
				break;
			case "S":
				this.addStyleClass("notificationSuccessMessage", true);
				break;
			case "W":
				this.addStyleClass("notificationWorningMessage", true);
				break;			
		}		
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<div id = \"" + this.getId() + "\" class=\"notificationMessageControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		if(this.getTextCode() !== ""){
			var aClone = [];
			if(this.textCodeParameters){
				aClone = this.textCodeParameters.slice(0);// copy of the array...
			}
			sHtml = sHtml + UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else
		{
			sHtml = sHtml + this.getText();
		}
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	getText: function(){
		if(this.getTextCode() !== ""){
			var aClone = this.textCodeParameters.slice(0);
			return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(), aClone);
		}
		else{
			return this.text;
		}
	},
	
	setText: function(sText){
		this.text = htmlEncode(sText);
	},
	
	getTextCodeParameters: function(){
		return this.textCodeParameters;
	},
	
	setTextCodeParameters: function(aTextCodeParameters){
		this.textCodeParameters = aTextCodeParameters;
	},	
	
	getTextCode: function(){
		return this.textCode;
	},
	
	setTextCode: function(sTextCode){
		this.textCode = sTextCode;
	},	
	
	getType: function(){
		return this.type;
	},
	
	setType: function(sType){
		this.type = sType;
	},		
	
	onAfterRendering: function(obj){
		var iLeftValue = parseInt(($( document ).width() - $("#" + obj.getId()).width())/2);// centering the message horizontally...
		$("#" + obj.getId()).css("left", iLeftValue + "px");
		
		obj.timeOutId = setTimeout($.proxy(function(){
			$("#" + this.getId()).fadeOut("slow", $.proxy(function(){
				this.destroy();
			}, this));
		}, obj), obj.duration);

		$("#" + obj.getId()).bind('click', obj, function(oEvent){
			clearTimeout(oEvent.data.timeOutId);
			//oEvent.data.destroy();
			$("#" + obj.getId()).fadeOut("slow", $.proxy(function(){
				this.destroy();
			}, obj));			
		});		
	}
});
var cPanelControl = Class.create();
cPanelControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.content = [];
		if(obj && obj.content){
			this.content = obj.content;
		}
		this.headerText = "";
		if(obj && obj.text){
			this.setHeaderText(obj.headerText, true);
		}

		this.headerTextCode = "";
		if(obj && obj.headerTextCode){
			this.setHeaderTextCode(obj.headerTextCode, true);
		}	
		this.headerTextCodeParameters = [];
		if(obj && obj.headerTextCodeParameters){
			this.setHeaderTextCodeParameters(obj.headerTextCodeParameters, true);
		}			
		
		this.headerLb = new cLabelControl(this.getId() + "HeaderLb", {
			text: this.getHeaderText(),
			textCode: this.getHeaderTextCode(),
			textCodeParameters: this.getHeaderTextCodeParameters(),
		});
		this.headerLb.addStyleClass("panelHeaderLb", true);
		
		this.collapseImg = new cImageControl(this.getId() + "HeaderCollapseImg", {
			 url: "img/expand.gif"
		});
		this.collapseImg.addStyleClass("panelHeaderImg", true);
		
		this.headerWp = new cWrapperControl(this.getId() + "HeaderWp", {content: [this.headerLb, this.collapseImg]});
		this.headerWp.addStyleClass("panelHeader", true);
		this.headerWp.onClick(this, this.onHeaderWpClick);
		
		this.expanded = false;
		if(obj && obj.expanded){
			this.setExpanded(obj.expanded);
		}
	},
	
	getHeaderText: function(){
		if(this.getHeaderTextCode() !== ""){
			var aClone = this.headerTextCodeParameters.slice(0);
			return UI_CONSTANTS.fnTextCodesHandeler(this.getHeaderTextCode(), aClone);
		}
		else{
			return this.headerText;
		}		
	},
	
	setHeaderText: function(sValue, bNotRerender){
		this.headerText = htmlEncode(sValue);//toUnicode(sText);
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}			
	},
	
	getHeaderTextCode: function(){
		return this.headerTextCode;
	},
	
	setHeaderTextCode: function(sValue, bNotRerender){
		this.headerTextCode = sValue;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},
	
	getHeaderTextCodeParameters: function(){
		return this.headerTextCodeParameters;		
	},
	
	setHeaderTextCodeParameters: function(aValues, bNotRerender){
		this.textCodeParameters = aValues;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}			
	},
	
	getExpanded: function(){
		return this.expanded;
	},
	
	setExpanded: function(bValue){
		this.expanded = bValue;
	}, 
	
	render: function(){
		var sHtml = "";
		
		sHtml = sHtml + "<div";
		
		if(this.getId()){
			sHtml = sHtml + " id = \"" + this.getId() + "\"";
		}
		sHtml = sHtml + " class=\"panelControl "; 			

		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";

		sHtml = sHtml + this.headerWp.render();
		
		sHtml = sHtml + "<div class=\"panelControlContent";
		
		if(this.expanded === false){
			sHtml = sHtml + "\" style=\"display: none;";
		}		
		sHtml = sHtml + "\">";
		
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + this.content[i].render();
		}	
		
		sHtml = sHtml + "</div>"; 
		
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	onHeaderWpClick: function(obj){
		obj.setExpanded(!obj.getExpanded());
		
		if(obj.getExpanded() === true){
			//$('#' + obj.getId() + ' .panelControlContent').removeClass('hiddenElement');
			obj.collapseImg.setUrl("img/collapse.gif");
			$('#' + obj.getId() + ' .panelControlContent').slideDown('slow');
		}
		else{
			//$('#' + obj.getId() + ' .panelControlContent').removeClasse('hiddenElement');
			obj.collapseImg.setUrl("img/expand.gif");
			$('#'+ obj.getId() + ' .panelControlContent').slideUp('slow');
		}		
		
		//$('#target').slideDown('slow');
		//some animation logic...
	},
	
//	onCollapseImgClick: function(obj){
//		if(!obj.bExpanded){
//			$("#" + obj.getId() + " .panelControlContent").removeClass("hiddenElement");
//			obj.oCollapseImg.setUrl("img/collapse.gif");
//			obj.bExpanded = true;
//		}
//		else{
//			$("#" + obj.getId() + " .panelControlContent").addClass("hiddenElement");
//			obj.oCollapseImg.setUrl("img/expand.gif");
//			obj.bExpanded = false;
//		}
//	},
//	
	onAfterRendering: function(){
			this.headerWp._onAfterRendering(this.headerWp);
	},
//	
//	onClick: function(obj, fnEventHandler){
//		var that = this;
//		var fnOnAfterRendering = this.onAfterRendering;
//		this.onAfterRendering = function(){
//			fnOnAfterRendering(that);
//			$("#" + that.id).unbind();//to clear all bindings first...
//			$("#" + that.id).bind('click', obj, function(){
//				fnEventHandler(obj);
//			});
//		};
//	},	
});
var cRadioButtonControl = Class.create();
cRadioButtonControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		this.label = "";
		if(obj && obj.label){
			this.label = obj.label;
		}			
		this.name = "";
		if(obj && obj.name){
			this.name = obj.name;
		}	
		this.checked = false;
		if(obj.checked){
			this.checked = obj.checked;				
		}			
		this.labelCode = "";
		if(obj && obj.labelCode){
			this.labelCode = obj.labelCode;
		}	
		this.labelCodeParameters = [];
		if(obj && obj.labelCodeParameters){
			this.labelCodeParameters = obj.labelCodeParameters;
		}			
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<div id=" + this.getId() + " class=\"radioButtonControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}			
		sHtml = sHtml + "\">";
		
		sHtml = sHtml + "<table><tr><td>";
		sHtml = sHtml + "<input id=" + this.getId() + "Content" + " type=radio name =" + this.getName();
		if(this.getChecked() ){
			sHtml = sHtml + " checked=checked";
		}
		sHtml = sHtml + ">";
		sHtml = sHtml + "</td>";		
		sHtml = sHtml + "<td>";
		sHtml = sHtml + "<span>";
		if(this.getLabelCode() !== ""){
			var aClone = this.labelCodeParameters.slice(0);// copy of the array...
			sHtml = sHtml + UI_CONSTANTS.fnTextCodesHandeler(this.getLabelCode(), aClone);
		}
		else
		{
			sHtml = sHtml + this.getLabel();
		}		
		sHtml = sHtml + "</span>";
		sHtml = sHtml + "</td> </tr> </table>  ";
		sHtml = sHtml + "</div>";
		return sHtml;		
	},
	
	getLabel: function(){
		return this.label;
	},
	
	setLabel: function(sLabel){
		this.label = sLabel;
		this.rerender();
	},
	
	getName: function(){
		return this.name;
	},
	
	setName: function(sName){
		this.name = sName;
		this.rerender();
	},
	
	getChecked: function(){
		return this.checked;
	},
	
	setChecked: function(sChecked){
		this.checked = sChecked;
		this.rerender();
	},	
	
	setParent: function(obj){
		this.parent = obj;
	},
	
	getParent: function(){
		return this.parent;
	},	
	
	getLabelCodeParameters: function(){
		return this.textLabelParameters;
	},
	
	setLabelCodeParameters: function(aLabelCodeParameters, bNotRerender){
		this.labelCodeParameters = aLabelCodeParameters;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},	
	
	getLabelCode: function(){
		return this.labelCode;
	},
	
	setLabelCode: function(sLabelCode, bNotRerender){
		this.labelCode = sLabelCode;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}		
	},		
	
	onAfterRendering: function(obj){
		if(obj){
			$("#" + obj.getId()).bind('click', obj, function(oEvent){
				oEvent.data.setChecked(true);
				for(var i = 0; i < obj.getParent().content.length; i++){
					if( obj.getParent().content[i].getId() != obj.getId()){
						obj.getParent().content[i].setChecked(false);
					}
					else{
						obj.getParent().setSelectedIndex(i);
					}					
				}
			});				
		}
		else{
			$("#" + this.getId()).bind('blur', this, function(oEvent){
				oEvent.data.setChecked(true);
				for(var i = 0; i < this.getParent().itcontentems.length; i++){
					if( this.getParent().content[i].getId() != this.getId()){
						this.getParent().content[i].setChecked(false);
					}
					else{
						this.getParent.setSelectedIndex(i);
					}
				}				
			});	
		}
	},	
	
	
	translate: function(){
		this.setLabelCode(this.getLabelCode());
	}
});

var cRadioButtonGroupControl = Class.create();
cRadioButtonGroupControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);		
		if(obj){
			if(obj.content){
				this.content = obj.content;
				for(var i = 0; i < this.content.length; i++){
					this.content[i].setParent(this);
				}
			}
			else{
				this.content = [];
			}
		}
		this.setSelectedIndex(0);
	},
	
	render: function(){
		var sHtml = "";
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + this.content[i].render();
		}
		return sHtml;		
	},
	
	setSelectedIndex: function(iValue){
		this.selectedIndex = iValue;
	},
	
	getSelectedIndex: function(){
		return this.selectedIndex;
	},	
	
	translate: function(){
		$.each (this.content, function(i, content){
			content.translate();
		});
	}	
});
var cTabControl = Class.create();
cTabControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		
		if(obj.headers === undefined || obj.headers === []){
			console.log("There were no headers provided for the tabControl...");
			return;
		}
		if(obj.content === undefined || obj.content === []){
			console.log("There were no items provided for the tabControl...");
			return;
		}	
		if(obj.headers.length !== obj.content.length){
			console.log("Number of the headers is not equal to the number of the items in the tabControl...");
			return;
		}
		
		this.headers = obj.headers;
		this.content = obj.content;
		
		for(var i = 0; i < this.headers.length; i++){
			this.headers[i].parent = this;
			this.headers[i].addStyleClass("tabControlHeadersItem", true);
			this.headers[i].onClick(this.headers[i], this.onHeaderClick);
		}
		for(var i = 0; i < this.content.length; i++){
			this.content[i].parent = this;
			this.content[i].removeStyleClass("tabControlItem", true);//for the global objects like views
			this.content[i].removeStyleClass("tabControlSelectedItem", true);//for the global objects like views
			
			this.content[i].addStyleClass("tabControlItem", true);
			if(typeof this.content[i].createContent === 'function'){// if content element has it's on method to create content
				this.content[i].removeContent(this.content[i]);
				this.content[i].createContent(this.content[i]);
			}
		}		
		this.bPreviousSelectionFinished = true;
		if(obj.selectedIndex){
			this.setSelectedIndex(obj.selectedIndex);
		}
		else{
			this.setSelectedIndex(0, true);
		}
	},
	
	render: function(){
		
		var sHtml = "";
		sHtml = sHtml + "<div \id=" + this.getId() + " class=\"tabControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";

		sHtml = sHtml + "<div  id=" + this.getId() + "Headers" + " class=\"tabControlHeaders\">";
		for(var i = 0; i < this.headers.length; i++){
			sHtml = sHtml + this.headers[i].render();
		}
		sHtml = sHtml + "</div>";
		
		sHtml = sHtml + "<div  id=" + this.getId() + "Items" + " class=\"tabControlItems\">";
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + this.content[i].render();
		}		
		sHtml = sHtml + "</div>";		
		
		sHtml = sHtml + "</div>";
		return sHtml;			
	},
	
	translate: function(obj){
		if(obj && obj.headers){
			for(var i = 0; i < obj.headers.length; i++){
				obj.headers[i].translate(obj.headers[i]);
			}			
		}
        if(!obj || !obj.content){
            return;     
         }  		
		for(var i = 0; i < obj.content.length; i++){
			if(obj.content[i].content && obj.content[i].content.length > 0){
				obj.content[i].translate(obj.content[i]);
			}
		}
		for(var i = 0; i < obj.content.length; i++){
			obj.content[i].translate();
		}			
	},
	
	getSelectedIndex: function(){
		return this.selectedIndex;
	},
	
	setSelectedIndex: function(iSelectedIndex, bNotRerender){
		if(!this.bPreviousSelectionFinished){
			return;
		}
		this.bPreviousSelectionFinished = false;	
		if(!(iSelectedIndex >= 0 && iSelectedIndex < this.headers.length)){
			console.log("Wrong new selected index specified for the tabControl...");
			this.bPreviousSelectionFinished = true;
			return;
		}
		if(this.getSelectedIndex() !== undefined){
			this.headers[this.getSelectedIndex()].removeStyleClass("tabControlSelectedHeadersItem", true);
			this.content[this.getSelectedIndex()].removeStyleClass("tabControlSelectedItem", true);	
			
			this.headers[this.getSelectedIndex()].addStyleClass("tabControlHeadersItem", true);
			this.content[this.getSelectedIndex()].addStyleClass("tabControlItem", true);	
		}
		
		this.headers[iSelectedIndex].removeStyleClass("tabControlHeadersItem", true);
		this.headers[iSelectedIndex].addStyleClass("tabControlSelectedHeadersItem", true);
		
		this.content[iSelectedIndex].removeStyleClass("tabControlItem", true);
		this.content[iSelectedIndex].addStyleClass("tabControlSelectedItem", true);
		
		if(this.getSelectedIndex() !== undefined && $("#" + this.getId()).length > 0){
			$("#" + this.getId() + " .tabControlItems:first").fadeOut(250, $.proxy(function(){
				for(var i = 0; i < this.headers.length; i++){
					this.headers[i].rerender();
				}
				if(this.content[this.getSelectedIndex()]){
					this.content[this.getSelectedIndex()].rerender(true, true);					
				}
				this.content[iSelectedIndex].rerender();
				setTimeout($.proxy(function(){this.scrollDownItemsArea()}, this), 50);
				$("#" + this.getId()).find(".tabControlItems:first").fadeIn(250, $.proxy(function(){
					this.selectedIndex = iSelectedIndex;
					this.bPreviousSelectionFinished = true;
				}, this));
				
			}, this));			
		}
		else{
			this.selectedIndex = iSelectedIndex;
			this.bPreviousSelectionFinished = true;
		}
	},
	
	onAfterRendering: function(){
		for(var i = 0; i < this.headers.length; i++){
			this.headers[i]._onAfterRendering(this.headers[i]);
		}
	},
	
	onHeaderClick: function(obj){
		for(var i = 0; i < obj.parent.headers.length; i++){
			if(obj.parent.headers[i].getId() === obj.getId()){
				obj.parent.setSelectedIndex(i);
			}
		}
		
	},
	
	scrollDownItemsArea: function(){//Tab content area can have scrolling. This method will scroll down tab content area 
		$("#" + this.getId()).find(".tabControlItems").prop("scrollTop", $("#" + this.getId()).find(".tabControlItems").prop("scrollHeight"));	
	}
});
var cTextAreaControl = Class.create();
cTextAreaControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj){
			if(obj.rows){
				this.rows = obj.rows;				
			}
			if(obj.cols){
				this.cols = obj.cols;				
			}
			if(obj.text){
				this.text = obj.text;				
			}
			if(obj.spellcheck){
				this.spellcheck = obj.spellcheck;
			}
			else{
				this.spellcheck = false;
			}			
		}
		
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<textarea  id=" + this.getId() + " rows=" + this.getRows() +  " cols=" + this.getCols() +" class=\"textAreaControl ";
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\" spellcheck=" + this.spellcheck + ">";
		if(this.getText()){
			sHtml = sHtml + this.getText();			
		}

		sHtml = sHtml + "</textarea>";
		return sHtml;		
	},
	
	getRows: function(){
		return this.rows;
	},
	
	setRows: function(iRows){
		this.rows = iRows;
		this.rerender();
	},
	
	getCols: function(){
		return this.cols;		
	},
	
	setCols: function(iCols){
		this.cols = iCols;
		this.rerender();		
	},	
	
	getText: function(){
		return this.text;		
	},
	
	setText: function(sText){
		this.text = sText;
		if(this.text !== sText){
			this.text = "";
			alert("Bad content in the textArea! TextArea's content was removed...");
			this.rerender();
			return;
		}		
		this.rerender();		
	},	
	
	onAfterRendering: function(){
		$("#" + this.getId()).bind('blur', this, function(oEvent){
			oEvent.data.setText($("#" + this.id).val(), true);
		});		
	},
	
//	onBlur: function(obj, fnEventHandler){
//		var that = this;
//		var fnOnAfterRendering = this.onAfterRendering;
//		this.onAfterRendering = function(){
//			fnOnAfterRendering(that);
//			$("#" + that.getId()).bind('blur', that, function(){
//				fnEventHandler(that);
//			});
//		};		
//	},	
});
var cVerticalLayoutControl = Class.create();
cVerticalLayoutControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.content){
			this.content = obj.content;
		}
		else{
			this.content = [];
		}
		this.contentItemStyleClass = "verticalLayoutItem";
	},
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<table id=" + this.id + " class=\"verticalLayoutControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
		sHtml = sHtml + this.styleClasses[i] + " ";
	}		
	sHtml = sHtml + "\">";		
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + "<tr class=\"verticalLayoutControlContentItem\">";
			sHtml = sHtml + "<td>";
			sHtml = sHtml + this.content[i].render();
			sHtml = sHtml + "</td>";			
			sHtml = sHtml + "</tr>";
		}
		sHtml = sHtml + "</table>"; 
		return sHtml;		
	},
	
	removeMessages: function(){
		$("#" + this.getId() + " .verticalLayoutMessage").remove();
	},
	
	addMessage: function(sMessage, sMessageType){
		this.removeMessages();
		var oMessage = new cLabelControl(this.getId() + "Message",{text: sMessage});		
		var oImage = new cImageControl(this.getId() + "Icon", {
			url: ""
		});			 
	
		var sMessageHtml = "<tr class=\"verticalLayoutMessage\">";
		switch (sMessageType){
			case "E":
				oImage.setUrl("img/alert_red_16.png");
				break;
			case "S":
				oImage.setUrl("img/accept_16.png");
				break;
			case "W":
				oImage.setUrl("img/alert_orange_16.png");
				break;				
		}
		sMessageHtml = sMessageHtml + "<td>";
		sMessageHtml = sMessageHtml + oImage.render();	
		sMessageHtml = sMessageHtml + "</td>";	
		sMessageHtml = sMessageHtml + "<td>";		
		sMessageHtml = sMessageHtml + oMessage.render();
		sMessageHtml = sMessageHtml + "</td>";			
		sMessageHtml = sMessageHtml + "</tr>";		

		$("#" + this.getId()).append(sMessageHtml);
	},
	
	appendContent: function(oItem){
		this.content.push(oItem);

		var sHtmlToAppend = "<tr class=\"verticalLayoutControlContentItem\">";
		sHtmlToAppend = sHtmlToAppend + "<td>";
		sHtmlToAppend = sHtmlToAppend + oItem.render();	
		sHtmlToAppend = sHtmlToAppend + "</td>";
		sHtmlToAppend = sHtmlToAppend + "</tr>";	
		
		$("#" + this.getId()).append(sHtmlToAppend);
		oItem._onAfterRendering(oItem);
	},
	
	showBusyIndicator: function(){
		var oImage = new cImageControl(this.getId() + "BusyIndicator", {
			url: "img/busyIndicator.gif"
		});	
		
		var sBusyIndicatorHtml = "<tr class=\"verticalLayoutBusyIndicator\">";
		sBusyIndicatorHtml = sBusyIndicatorHtml + "<td>";
		sBusyIndicatorHtml = sBusyIndicatorHtml + oImage.render();	
		sBusyIndicatorHtml = sBusyIndicatorHtml + "</td>";	
		sBusyIndicatorHtml = sBusyIndicatorHtml + "</tr>";	
		
		$("#" + this.getId()).append(sBusyIndicatorHtml);		
	},
	
	hideBusyIndicator: function(){
		$("#" + this.getId() + " .verticalLayoutBusyIndicator").remove();
	}
});
var cVideoControl = Class.create();
cVideoControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj){
			if(obj.src){
				this.src = obj.src;				
			}
			if(obj.height){
				this.height = obj.height;			
			}
			if(obj.width){
				this.width = obj.width;			
			}			
		}
	},
	
	getSrc: function(){
		return this.src;
	},
	
	setSrc: function(sSrc){
		this.src = sSrc;
		this.rerender();		
	},	
	
	getHeight: function(){
		return this.height;
	},
	
	setHeight: function(sHeight){
		this.height = sHeight;
		this.rerender();		
	},	
	
	getWidth: function(){
		return this.width;
	},
	
	setWidth: function(sWidth){
		this.width = sWidth;
		this.rerender();		
	},		
	
	render: function(){
		var sHtml = "";
		sHtml = sHtml + "<video id=" + this.id + " class=\"videoControl "; 
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\" height=\"" +  this.height  + "\" width=\"" + this.width +"\" controls>";
		sHtml = sHtml + "<source src=\"" + this.src + "\"" + "type=\"video/mp4\" >" + "</video>"; 
		return sHtml;		
	},
});
var cViewControl = Class.create();
cViewControl.prototype  = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj){
			if(obj.content){
				this.content = obj.content;
			}
			else{
				this.content = [];
			}
			if(obj.oTitle){
				this.oTitle = obj.oTitle;
			}
			if(obj.isStatic){
				this.isStatic = obj.isStatic;
			}			
			if(obj.roleDependentContent === false){
				this.roleDependentContent = obj.roleDependentContent;
			}
			else{
				this.roleDependentContent = true;				
			}
			if(obj.oAllowedRoles){
				this.oAllowedRoles = obj.oAllowedRoles;
			}
		}
	},
	
	render: function(){
		var sHtml = "";
		sHtml = "<div id=" + this.id + " class=\"viewControl ";
		
		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";
		
		if(this.oTitle){
			sHtml = sHtml + "<div id=" + this.id + "Title class=viewControlTitle>" + this.oTitle.render() + "</div>";
		}
		sHtml = sHtml + "<div id=" + this.id + "Content class=viewControlContent>"; 
		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + this.content[i].render();
		}
		sHtml = sHtml + "</div>";
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	translate: function(obj){
		if(obj && obj.oTitle){
			obj.oTitle.translate(obj.oTitle);			
		}
        if(!obj || !obj.content){
            return;     
         }  		
		for(var i = 0; i < obj.content.length; i++){
			if(obj.content[i].content && obj.content[i].content.length > 0){
				obj.content[i].translate(obj.content[i]);
			}
		}
		for(var i = 0; i < obj.content.length; i++){
			obj.content[i].translate();
		}		
	},
	
	createContent: function(sRole){	
		if(!this.getRoleDependentContent()){
			this._createContentForGuest();
			return;
		}
		switch(sRole){
			case "Guest":
				this._createContentForGuest();
				break;			
			case "Member":
				this._createContentForMember();
				break;
			case "Performer":
				this._createContentForPerformer();
				break;	
			case "TechnicalAdministrator":
				this._createContentForTechAdmin();
				break;					
		}
	},
	
	_createContentForGuest: function(){},
	_createContentForMember: function(){},
	_createContentForPerformer: function(){},
	_createContentForTechAdmin: function(){},
	_createContent: function(){},
	
	_exitGuest: function(){},
	_exitMember: function(){},
	_exitPerformer: function(){},	
	

	onExit: function(){},
	
	_onExit: function(bRefreshContent){
		fnExecutOnExit(this);		
	},
	
	getRoleDependentContent: function(){
		return this.roleDependentContent;
	},
	
	setRoleDependentContent: function(bValue){
		this.roleDependentContent = bValue;
		this.rerender();		
	},
	
	getTitle: function(){
		return this.oTitle;
	},
	
	setTitle: function(oValue, bNotRerender){
		this.oTitle = oValue;
		if(bNotRerender === false || bNotRerender === undefined){
			this.rerender();			
		}
	},
	
	getTitleTextId: function(){
		return this.titleTextId;
	},
	
	setTitleTextId: function(sValue){
		this.titleTExtId = sValue;

	},	
	
	onExit: function(sRole){},
	
	exitConfirmation: function(){
		return true;
	},
	
	onAfterRendering: function(obj, bWithoutOnViewInstanceAfterRendering){
		if(!this.isStatic){
			var iOccupiedSpace = $("#header").height() + $("#navigationPanel").height();
			iOccupiedSpace = iOccupiedSpace + $("#" + this.getId() + "Content").height() + $("#footer").height() + 32;
			
			if(iOccupiedSpace < $(window).height()){
				$("#contentArea").css("min-height", $("#" + this.getId() + "Content").height() + $(window).height() - iOccupiedSpace + "px");
//				var iFooterMarginTop = $(window).height() - $("#header").height() - $("#navigationPanel").height();
//				iFooterMarginTop = iFooterMarginTop - $("#contentArea").height() - $("#footer").height() - 32;
//				$("#footer").css("margin-top", iFooterMarginTop + "px");
			}			
		}
		if(!bWithoutOnViewInstanceAfterRendering){
			this.onViewInstanceAfterRendering();			
		}

	},
	
	onViewInstanceAfterRendering: function(){}
});


	

var cWrapperControl = Class.create();
cWrapperControl.prototype = Object.extend(new cBasicControl(), {
	initialize: function(id, obj) {
		this.basicInitialize(id, obj);
		if(obj && obj.content){
			this.content = obj.content;
		}
		else{
			this.content = [];
		}
	},
	
	render: function(){
		var sHtml = "";
		
		sHtml = sHtml + "<div";
		
		if(this.getId()){
			sHtml = sHtml + " id = \"" + this.getId() + "\"";
		}
		
		sHtml = sHtml + " class=\"wrapperControl "; 			

		for(var i = 0; i < this.styleClasses.length; i++){
			sHtml = sHtml + this.styleClasses[i] + " ";
		}		
		sHtml = sHtml + "\">";

		for(var i = 0; i < this.content.length; i++){
			sHtml = sHtml + this.content[i].render();
		}	
		
		sHtml = sHtml + "</div>"; 
		return sHtml;		
	},
	
	onClick: function(obj, fnEventHandler){
		var that = this;
		var fnOnAfterRendering = this.onAfterRendering;
		this.onAfterRendering = function(){
			fnOnAfterRendering(that);
			$("#" + that.id).unbind();//to clear all bindings first...
			$("#" + that.id).bind('click', obj, function(){
				fnEventHandler(obj);
			});
		};
	},		

});
