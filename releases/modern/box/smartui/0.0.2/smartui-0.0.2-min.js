var UI_CONSTANTS=(function(b){var a={};
a.defaultUILanguage="en";
a.avatarServiceURL="http://en.gravatar.com/";
a.FMServerURL="rtmp://qww7c0.live.cloud.influxis.com/qww7c0/_definst_/";
a.trDescriptionPayPalCompleted="PayPalCompleted";
a.trDescriptionPayPalPending="PayPalPending";
a.refreshParticipantsInterval=3000;
a.fnTextCodesHandeler=function(d,c){if(c.length>=1){c.unshift(d);
return jQuery.i18n.prop.apply(undefined,c)
}else{return jQuery.i18n.prop(d)
}};
a.defaultNotificationMessageDuration=5000;
return a
}(jQuery));
var cBasicControl=Class.create();
cBasicControl.prototype={basicInitialize:function(b,a){this.id=b;
this.styleClasses=[]
},initialize:function(){},render:function(){},destroy:function(){$("#"+this.id).remove();
$("#"+this.id).unbind()
},placeAt:function(a){this._onBeforeRendering(this);
var b=this.render();
$($("#"+a)[0]).append(b);
this._onAfterRendering(this)
},rerender:function(a,d){if(!a){this._onBeforeRendering(this)
}var c=this.render();
var b=$($("#"+this.id).parent()[0]).children().index($("#"+this.id));
$($($("#"+this.id).parent()[0]).children()[b]).after(c);
this.destroy();
if(!d){this._onAfterRendering(this)
}},addStyleClass:function(a,b){this.removeStyleClass(a,true);
this.styleClasses.push(a);
if(b===false||b===undefined){this.rerender()
}},removeStyleClass:function(a,c){for(var b=0;
b<this.styleClasses.length;
b++){if(this.styleClasses[b]==a){this.styleClasses.splice(b,1);
break
}}if(c===false||c===undefined){this.rerender()
}},hasStyleClass:function(a){for(var b=0;
b<this.styleClasses.length;
b++){if(this.styleClasses[b]==a){return true
}}return false
},onBeforeRendering:function(){},_onBeforeRendering:function(b){b.onBeforeRendering();
if(b&&b.content&&b.content.length){for(var a=0;
a<b.content.length;
a++){b.content[a]._onBeforeRendering(b.content[a])
}}},onAfterRendering:function(a){},_onAfterRendering:function(a){a.onAfterRendering(a);
this.onContentAfterRendering(a);
this.onFinalAfterRendering(a)
},onContentAfterRendering:function(b){if(b&&b.content&&b.content.length){for(var a=0;
a<b.content.length;
a++){b.content[a]._onAfterRendering(b.content[a])
}}},onFinalAfterRendering:function(a){},addContent:function(a){for(var b=0;
b<a.length;
b++){this.content.push(a[b])
}},removeContent:function(b){for(var a=0;
a<b.content.length;
a++){if(b.content[a].content&&b.content[a].length>0){b.removeContent(b.content[a])
}}while(b.content.length){b.content.splice(0,1)
}},getId:function(){return this.id
},translate:function(b){if(!b||!b.content){return
}for(var a=0;
a<b.content.length;
a++){if(b.content[a].content&&b.content[a].content.length>0){b.content[a].translate(b.content[a])
}}for(var a=0;
a<b.content.length;
a++){b.content[a].translate()
}}};
var cAudioControl=Class.create();
cAudioControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.src){this.src=a.src
}},render:function(){var b="";
b=b+'<audio id = "'+this.getId()+'" class="audioControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+"<source src="+this.getSrc()+"></source>";
b=b+"</audio>";
return b
},getSrc:function(){return this.src
},setSrc:function(a){this.src=a;
this.rerender()
},});
var cButtonControl=Class.create();
cButtonControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.text){this.text=a.text
}if(a&&a.disabled){this.disabled=true
}else{this.disabled=false
}this.textCode="";
if(a&&a.textCode){this.textCode=a.textCode
}this.textCodeParameters=[];
if(a&&a.textCodeParameters){this.textCodeParameters=a.textCodeParameters
}},render:function(){var c="";
c=c+"<button id = "+this.id+' class="buttonControl ';
for(var a=0;
a<this.styleClasses.length;
a++){c=c+this.styleClasses[a]+" "
}c=c+'"';
if(this.disabled){c=c+" disabled"
}c=c+">";
if(this.getTextCode()!==""){var b=this.textCodeParameters.slice(0);
c=c+UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),b)
}else{c=c+this.getText()
}c=c+"</button>";
return c
},getText:function(){if(this.getTextCode()!==""){var a=this.textCodeParameters.slice(0);
return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),a)
}else{return this.text
}},setText:function(a,b){this.text=a;
if(b===false||b===undefined){this.rerender()
}},getDisabled:function(){return this.disabled
},setDisabled:function(a,b){this.disabled=a;
if(b===false||b===undefined){this.rerender()
}},getTextCode:function(){return this.textCode
},setTextCode:function(a,b){this.textCode=a;
if(b===false||b===undefined){this.rerender()
}},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).unbind();
$("#"+c.id).bind("click",d,function(){b(d)
})
}
},translate:function(){this.setTextCode(this.getTextCode())
}});
var cCheckBoxControl=Class.create();
cCheckBoxControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a){if(a.label){this.label=a.label
}if(a.name){this.name=a.name
}if(a.checked){this.checked=a.checked
}if(a.disabled){this.disabled=a.disabled
}}},setLabel:function(a){this.label=a;
this.rerender()
},getLabel:function(){return this.label
},setName:function(a){this.name=a;
this.rerender()
},getName:function(){return this.name
},setChecked:function(a){this.checked=a;
this.rerender()
},setDisabled:function(a){this.disabled=a;
this.rerender()
},getChecked:function(){return this.checked
},getDisabled:function(){return this.disabled
},render:function(){var b="";
b=b+"<div id="+this.getId()+' class="checkBoxControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+" <input id="+this.getId()+"Content type=checkbox name="+this.getName();
if(this.getChecked()){b=b+" checked=checked"
}if(this.getDisabled()){b=b+" disabled=disabled"
}b=b+"><span>"+this.getLabel()+"</span>";
b=b+"</div>";
return b
},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.getId()+"Content").bind("click",c,function(){b(c)
})
}
},});
var cDropDownBoxControl=Class.create();
cDropDownBoxControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a.value){this.value=a.value
}if(a.items){this.items=a.items
}else{this.items=[]
}},render:function(){var b="";
b=b+'<select id = "'+this.getId()+'" class="dropDownBoxControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
for(var a=0;
a<this.items.length;
a++){b=b+'<option value="'+this.items[a].getText()+'">'+this.items[a].getText()+"</option>"
}b=b+"</select>";
return b
},getValue:function(){return this.value
},setValue:function(b,a){this.value=b;
if(a===false||a===undefined){$("#"+this.getId()).val(b)
}},onAfterRendering:function(b){if(b){$("#"+b.getId()).bind("change",b,function(c){c.data.setValue($("#"+b.getId()).val(),true)
})
}else{var a=this;
$("#"+this.getId()).bind("change",this,function(c){c.data.setValue($("#"+a.getId()).val(),true)
})
}},});
var cHorizontalLayoutControl=Class.create();
cHorizontalLayoutControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.content){this.content=a.content
}else{this.content=[]
}this.contentItemStyleClass="horizontalLayoutItem"
},render:function(){var b="";
b=b+"<table id="+this.id+' class="horizontalLayoutControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+"<tr>";
for(var a=0;
a<this.content.length;
a++){b=b+'<td class="horizontalLayoutControlContentItem">';
b=b+this.content[a].render();
b=b+"</td>"
}b=b+"</tr>";
b=b+"</table>";
return b
},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).unbind();
$("#"+c.id).bind("click",d,function(){b(d)
})
}
},});
var cHtmlControl=Class.create();
cHtmlControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.html){this.html=a.html
}},render:function(){var b="";
b=b+'<div id = "'+this.getId()+'" class="htmlControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
if(this.getHtml()){b=b+this.getHtml()
}b=b+"</div>";
return b
},getHtml:function(){return this.html
},setHtml:function(a){this.html=a;
this.rerender()
},});
var cHtmlEditorControl=Class.create();
cHtmlEditorControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.html="";
if(a&&a.html){this.setHtml(a.html,true)
}this.editable=false;
if(a&&a.editable){this.setEditable(a.editable,true)
}this.addStyleClass("clear",true)
},render:function(){var b="";
b=b+'<div id = "'+this.getId()+'" class="htmlEditorControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+'<div id = "'+this.getId()+'Toolbar" class="htmlEditorControlToolbar"> </div>';
b=b+'<div id = "'+this.getId()+'Editor" class="htmlEditorControlEditor">';
if(this.getHtml()){b=b+this.getHtml()
}b=b+"</div>";
b=b+"</div>";
return b
},onAfterRendering:function(b){$("#"+this.getId()+"Editor").freshereditor({toolbar_selector:"#"+this.getId()+"Toolbar",excludes:["removeFormat","insertheading4"]});
$("#"+this.getId()+"Editor").freshereditor("edit",this.getEditable());
if(!this.getEditable){$("#"+this.getId()+"Toolbar").css("dislay, none")
}else{$("#"+this.getId()+"Toolbar").css("dislay, block")
}if(b){$("#"+b.getId()+"Editor").bind("blur",b,function(c){c.data.setHtml($("#"+b.getId()+"Editor").html(),true)
})
}else{var a=this;
$("#"+this.getId()+"Editor").bind("blur",this,function(c){c.data.setHtml($("#"+a.getId()+"Editor").html(),true)
})
}},getHtml:function(){return this.html
},getHtmlContent:function(){return $("#"+this.getId()+"Editor").html()
},setHtml:function(a,b){this.html=a;
if(b===false||b===undefined){this.rerender()
}},getEditable:function(){return this.editable
},setEditable:function(a,b){this.editable=a;
if(b===false||b===undefined){this.rerender()
}},});
var cImageControl=Class.create();
cImageControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.url="";
if(a&&a.url){this.url=a.url
}},render:function(){var b="";
b=b+"<span id="+this.getId()+"Wrapper >";
b=b+"<img id='"+this.getId()+"' src='"+this.getUrl()+"' class=\"imageControl ";
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+"</span>";
return b
},getUrl:function(){return this.url
},refresh:function(a){$("#"+this.getId()).attr("src",this.getUrl())
},setUrl:function(a){this.url=a;
if(this.url!==""){this.refresh()
}},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).unbind();
$("#"+c.id).bind("click",d,function(){b(d)
})
}
},});
var cInputFieldControl=Class.create();
cInputFieldControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a.type){this.type=a.type
}if(a.readonly){this.readonly=a.readonly
}else{this.readonly=false
}if(a.value){this.value=a.value
}else{this.value=""
}if(a.spellcheck){this.spellcheck=a.spellcheck
}else{this.spellcheck=false
}},render:function(){var b="";
b=b+"<input id="+this.id+" type="+this.type+' class="inputFieldControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}if(this.getValue()){b=b+'" value="'+this.getValue()
}b=b+'"';
if(this.getReadonly()){b=b+" readonly=redonly"
}b=b+" spellcheck="+this.spellcheck+">";
return b
},setReadonly:function(a,b){this.readonly=a;
if(b===false||b===undefined){this.rerender()
}},getReadonly:function(){return this.readonly
},setValue:function(b,a){this.value=b;
if(a===false||a===undefined){this.rerender()
}},getValue:function(){return this.value
},getType:function(){return this.type
},onAfterRendering:function(b){if(b){$("#"+b.getId()).bind("blur",b,function(c){c.data.setValue($("#"+b.getId()).val(),true)
})
}else{var a=this;
$("#"+this.getId()).bind("blur",this,function(c){c.data.setValue($("#"+a.getId()).val(),true)
})
}},onKeyUp:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).bind("keyup",d,function(e){e.data.setValue($("#"+d.getId()).val(),true);
b(d,e)
})
}
},setFocus:function(){$("#"+this.getId()).focus()
},});
var cLabelControl=Class.create();
cLabelControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.text="";
if(a&&a.text){this.setText(a.text)
}this.backgroundImg="";
if(a&&a.backgroundImg){this.backgroundImg=a.backgroundImg
}this.textCode="";
if(a&&a.textCode){this.textCode=a.textCode
}this.textCodeParameters=[];
if(a&&a.textCodeParameters){this.textCodeParameters=a.textCodeParameters
}},render:function(){var c="";
c=c+"<span";
if(this.getId()){c=c+' id = "'+this.getId()+'"'
}c=c+' class="labelControl ';
for(var a=0;
a<this.styleClasses.length;
a++){c=c+this.styleClasses[a]+" "
}c=c+'">';
if(this.getTextCode()!==""){var b=[];
if(this.textCodeParameters){b=this.textCodeParameters.slice(0)
}c=c+UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),b)
}else{c=c+this.getText()
}c=c+"</span>";
return c
},getText:function(){if(this.getTextCode()!==""){var a=this.textCodeParameters.slice(0);
return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),a)
}else{return this.text
}},setText:function(a,b){this.text=htmlEncode(a);
if(b===false||b===undefined){this.rerender()
}},getTextCodeParameters:function(){return this.textCodeParameters
},setTextCodeParameters:function(a,b){this.textCodeParameters=a;
if(b===false||b===undefined){this.rerender()
}},getTextCode:function(){return this.textCode
},setTextCode:function(a,b){this.textCode=a;
if(b===false||b===undefined){this.rerender()
}},getBackgroundImg:function(){return this.backgroundImg
},setBackgroundImg:function(a){this.backgroundImg=a;
this.rerender()
},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).unbind();
$("#"+c.id).bind("click",d,function(){b(d)
})
}
},onAfterRendering:function(a){if(a.getBackgroundImg()!==""&&a.getBackgroundImg()!==undefined){$("#"+a.getId()).css("background-image",'url("'+a.getBackgroundImg()+'")');
$("#"+a.getId()).css("background-repeat","no-repeat");
$("#"+a.getId()).css("background-size","cover")
}},translate:function(){this.setTextCode(this.getTextCode())
}});
var cNotificationMessageControl=Class.create();
cNotificationMessageControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.type="S";
if(a&&a.type){this.setType(a.type)
}this.text="";
if(a&&a.text){this.setText(a.text)
}this.textCode="";
if(a&&a.textCode){this.textCode=a.textCode
}this.textCodeParameters=[];
if(a&&a.textCodeParameters){this.textCodeParameters=a.textCodeParameters
}this.duration=UI_CONSTANTS.defaultNotificationMessageDuration;
if(a&&a.duration){this.duration=a.duration
}switch(this.type){case"E":this.addStyleClass("notificationErrorMessage",true);
break;
case"S":this.addStyleClass("notificationSuccessMessage",true);
break;
case"W":this.addStyleClass("notificationWorningMessage",true);
break
}},render:function(){var c="";
c=c+'<div id = "'+this.getId()+'" class="notificationMessageControl ';
for(var a=0;
a<this.styleClasses.length;
a++){c=c+this.styleClasses[a]+" "
}c=c+'">';
if(this.getTextCode()!==""){var b=[];
if(this.textCodeParameters){b=this.textCodeParameters.slice(0)
}c=c+UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),b)
}else{c=c+this.getText()
}c=c+"</div>";
return c
},getText:function(){if(this.getTextCode()!==""){var a=this.textCodeParameters.slice(0);
return UI_CONSTANTS.fnTextCodesHandeler(this.getTextCode(),a)
}else{return this.text
}},setText:function(a){this.text=htmlEncode(a)
},getTextCodeParameters:function(){return this.textCodeParameters
},setTextCodeParameters:function(a){this.textCodeParameters=a
},getTextCode:function(){return this.textCode
},setTextCode:function(a){this.textCode=a
},getType:function(){return this.type
},setType:function(a){this.type=a
},onAfterRendering:function(b){var a=parseInt(($(document).width()-$("#"+b.getId()).width())/2);
$("#"+b.getId()).css("left",a+"px");
b.timeOutId=setTimeout($.proxy(function(){$("#"+this.getId()).fadeOut("slow",$.proxy(function(){this.destroy()
},this))
},b),b.duration);
$("#"+b.getId()).bind("click",b,function(c){clearTimeout(c.data.timeOutId);
$("#"+b.getId()).fadeOut("slow",$.proxy(function(){this.destroy()
},b))
})
}});
var cPanelControl=Class.create();
cPanelControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.content=[];
if(a&&a.content){this.content=a.content
}this.headerText="";
if(a&&a.text){this.setHeaderText(a.headerText,true)
}this.headerTextCode="";
if(a&&a.headerTextCode){this.setHeaderTextCode(a.headerTextCode,true)
}this.headerTextCodeParameters=[];
if(a&&a.headerTextCodeParameters){this.setHeaderTextCodeParameters(a.headerTextCodeParameters,true)
}this.headerLb=new cLabelControl(this.getId()+"HeaderLb",{text:this.getHeaderText(),textCode:this.getHeaderTextCode(),textCodeParameters:this.getHeaderTextCodeParameters(),});
this.headerLb.addStyleClass("panelHeaderLb",true);
this.collapseImg=new cImageControl(this.getId()+"HeaderCollapseImg",{url:"img/expand.gif"});
this.collapseImg.addStyleClass("panelHeaderImg",true);
this.headerWp=new cWrapperControl(this.getId()+"HeaderWp",{content:[this.headerLb,this.collapseImg]});
this.headerWp.addStyleClass("panelHeader",true);
this.headerWp.onClick(this,this.onHeaderWpClick);
this.expanded=false;
if(a&&a.expanded){this.setExpanded(a.expanded)
}},getHeaderText:function(){if(this.getHeaderTextCode()!==""){var a=this.headerTextCodeParameters.slice(0);
return UI_CONSTANTS.fnTextCodesHandeler(this.getHeaderTextCode(),a)
}else{return this.headerText
}},setHeaderText:function(b,a){this.headerText=htmlEncode(b);
if(a===false||a===undefined){this.rerender()
}},getHeaderTextCode:function(){return this.headerTextCode
},setHeaderTextCode:function(b,a){this.headerTextCode=b;
if(a===false||a===undefined){this.rerender()
}},getHeaderTextCodeParameters:function(){return this.headerTextCodeParameters
},setHeaderTextCodeParameters:function(a,b){this.textCodeParameters=a;
if(b===false||b===undefined){this.rerender()
}},getExpanded:function(){return this.expanded
},setExpanded:function(a){this.expanded=a
},render:function(){var b="";
b=b+"<div";
if(this.getId()){b=b+' id = "'+this.getId()+'"'
}b=b+' class="panelControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+this.headerWp.render();
b=b+'<div class="panelControlContent';
if(this.expanded===false){b=b+'" style="display: none;'
}b=b+'">';
for(var a=0;
a<this.content.length;
a++){b=b+this.content[a].render()
}b=b+"</div>";
b=b+"</div>";
return b
},onHeaderWpClick:function(a){a.setExpanded(!a.getExpanded());
if(a.getExpanded()===true){a.collapseImg.setUrl("img/collapse.gif");
$("#"+a.getId()+" .panelControlContent").slideDown("slow")
}else{a.collapseImg.setUrl("img/expand.gif");
$("#"+a.getId()+" .panelControlContent").slideUp("slow")
}},onAfterRendering:function(){this.headerWp._onAfterRendering(this.headerWp)
},});
var cRadioButtonControl=Class.create();
cRadioButtonControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
this.label="";
if(a&&a.label){this.label=a.label
}this.name="";
if(a&&a.name){this.name=a.name
}this.checked=false;
if(a.checked){this.checked=a.checked
}this.labelCode="";
if(a&&a.labelCode){this.labelCode=a.labelCode
}this.labelCodeParameters=[];
if(a&&a.labelCodeParameters){this.labelCodeParameters=a.labelCodeParameters
}},render:function(){var c="";
c=c+"<div id="+this.getId()+' class="radioButtonControl ';
for(var a=0;
a<this.styleClasses.length;
a++){c=c+this.styleClasses[a]+" "
}c=c+'">';
c=c+"<table><tr><td>";
c=c+"<input id="+this.getId()+"Content type=radio name ="+this.getName();
if(this.getChecked()){c=c+" checked=checked"
}c=c+">";
c=c+"</td>";
c=c+"<td>";
c=c+"<span>";
if(this.getLabelCode()!==""){var b=this.labelCodeParameters.slice(0);
c=c+UI_CONSTANTS.fnTextCodesHandeler(this.getLabelCode(),b)
}else{c=c+this.getLabel()
}c=c+"</span>";
c=c+"</td> </tr> </table>  ";
c=c+"</div>";
return c
},getLabel:function(){return this.label
},setLabel:function(a){this.label=a;
this.rerender()
},getName:function(){return this.name
},setName:function(a){this.name=a;
this.rerender()
},getChecked:function(){return this.checked
},setChecked:function(a){this.checked=a;
this.rerender()
},setParent:function(a){this.parent=a
},getParent:function(){return this.parent
},getLabelCodeParameters:function(){return this.textLabelParameters
},setLabelCodeParameters:function(a,b){this.labelCodeParameters=a;
if(b===false||b===undefined){this.rerender()
}},getLabelCode:function(){return this.labelCode
},setLabelCode:function(b,a){this.labelCode=b;
if(a===false||a===undefined){this.rerender()
}},onAfterRendering:function(a){if(a){$("#"+a.getId()).bind("click",a,function(b){b.data.setChecked(true);
for(var c=0;
c<a.getParent().content.length;
c++){if(a.getParent().content[c].getId()!=a.getId()){a.getParent().content[c].setChecked(false)
}else{a.getParent().setSelectedIndex(c)
}}})
}else{$("#"+this.getId()).bind("blur",this,function(b){b.data.setChecked(true);
for(var c=0;
c<this.getParent().itcontentems.length;
c++){if(this.getParent().content[c].getId()!=this.getId()){this.getParent().content[c].setChecked(false)
}else{this.getParent.setSelectedIndex(c)
}}})
}},translate:function(){this.setLabelCode(this.getLabelCode())
}});
var cRadioButtonGroupControl=Class.create();
cRadioButtonGroupControl.prototype=Object.extend(new cBasicControl(),{initialize:function(c,b){this.basicInitialize(c,b);
if(b){if(b.content){this.content=b.content;
for(var a=0;
a<this.content.length;
a++){this.content[a].setParent(this)
}}else{this.content=[]
}}this.setSelectedIndex(0)
},render:function(){var b="";
for(var a=0;
a<this.content.length;
a++){b=b+this.content[a].render()
}return b
},setSelectedIndex:function(a){this.selectedIndex=a
},getSelectedIndex:function(){return this.selectedIndex
},translate:function(){$.each(this.content,function(a,b){b.translate()
})
}});
var cTabControl=Class.create();
cTabControl.prototype=Object.extend(new cBasicControl(),{initialize:function(c,b){this.basicInitialize(c,b);
if(b.headers===undefined||b.headers===[]){console.log("There were no headers provided for the tabControl...");
return
}if(b.content===undefined||b.content===[]){console.log("There were no items provided for the tabControl...");
return
}if(b.headers.length!==b.content.length){console.log("Number of the headers is not equal to the number of the items in the tabControl...");
return
}this.headers=b.headers;
this.content=b.content;
for(var a=0;
a<this.headers.length;
a++){this.headers[a].parent=this;
this.headers[a].addStyleClass("tabControlHeadersItem",true);
this.headers[a].onClick(this.headers[a],this.onHeaderClick)
}for(var a=0;
a<this.content.length;
a++){this.content[a].parent=this;
this.content[a].removeStyleClass("tabControlItem",true);
this.content[a].removeStyleClass("tabControlSelectedItem",true);
this.content[a].addStyleClass("tabControlItem",true);
if(typeof this.content[a].createContent==="function"){this.content[a].removeContent(this.content[a]);
this.content[a].createContent(this.content[a])
}}this.bPreviousSelectionFinished=true;
if(b.selectedIndex){this.setSelectedIndex(b.selectedIndex)
}else{this.setSelectedIndex(0,true)
}},render:function(){var b="";
b=b+"<div id="+this.getId()+' class="tabControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
b=b+"<div  id="+this.getId()+'Headers class="tabControlHeaders">';
for(var a=0;
a<this.headers.length;
a++){b=b+this.headers[a].render()
}b=b+"</div>";
b=b+"<div  id="+this.getId()+'Items class="tabControlItems">';
for(var a=0;
a<this.content.length;
a++){b=b+this.content[a].render()
}b=b+"</div>";
b=b+"</div>";
return b
},translate:function(b){if(b&&b.headers){for(var a=0;
a<b.headers.length;
a++){b.headers[a].translate(b.headers[a])
}}if(!b||!b.content){return
}for(var a=0;
a<b.content.length;
a++){if(b.content[a].content&&b.content[a].content.length>0){b.content[a].translate(b.content[a])
}}for(var a=0;
a<b.content.length;
a++){b.content[a].translate()
}},getSelectedIndex:function(){return this.selectedIndex
},setSelectedIndex:function(a,b){if(!this.bPreviousSelectionFinished){return
}this.bPreviousSelectionFinished=false;
if(!(a>=0&&a<this.headers.length)){console.log("Wrong new selected index specified for the tabControl...");
this.bPreviousSelectionFinished=true;
return
}if(this.getSelectedIndex()!==undefined){this.headers[this.getSelectedIndex()].removeStyleClass("tabControlSelectedHeadersItem",true);
this.content[this.getSelectedIndex()].removeStyleClass("tabControlSelectedItem",true);
this.headers[this.getSelectedIndex()].addStyleClass("tabControlHeadersItem",true);
this.content[this.getSelectedIndex()].addStyleClass("tabControlItem",true)
}this.headers[a].removeStyleClass("tabControlHeadersItem",true);
this.headers[a].addStyleClass("tabControlSelectedHeadersItem",true);
this.content[a].removeStyleClass("tabControlItem",true);
this.content[a].addStyleClass("tabControlSelectedItem",true);
if(this.getSelectedIndex()!==undefined&&$("#"+this.getId()).length>0){$("#"+this.getId()+" .tabControlItems:first").fadeOut(250,$.proxy(function(){for(var c=0;
c<this.headers.length;
c++){this.headers[c].rerender()
}if(this.content[this.getSelectedIndex()]){this.content[this.getSelectedIndex()].rerender(true,true)
}this.content[a].rerender();
setTimeout($.proxy(function(){this.scrollDownItemsArea()
},this),50);
$("#"+this.getId()).find(".tabControlItems:first").fadeIn(250,$.proxy(function(){this.selectedIndex=a;
this.bPreviousSelectionFinished=true
},this))
},this))
}else{this.selectedIndex=a;
this.bPreviousSelectionFinished=true
}},onAfterRendering:function(){for(var a=0;
a<this.headers.length;
a++){this.headers[a]._onAfterRendering(this.headers[a])
}},onHeaderClick:function(b){for(var a=0;
a<b.parent.headers.length;
a++){if(b.parent.headers[a].getId()===b.getId()){b.parent.setSelectedIndex(a)
}}},scrollDownItemsArea:function(){$("#"+this.getId()).find(".tabControlItems").prop("scrollTop",$("#"+this.getId()).find(".tabControlItems").prop("scrollHeight"))
}});
var cTextAreaControl=Class.create();
cTextAreaControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a){if(a.rows){this.rows=a.rows
}if(a.cols){this.cols=a.cols
}if(a.text){this.text=a.text
}if(a.spellcheck){this.spellcheck=a.spellcheck
}else{this.spellcheck=false
}}},render:function(){var b="";
b=b+"<textarea  id="+this.getId()+" rows="+this.getRows()+" cols="+this.getCols()+' class="textAreaControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'" spellcheck='+this.spellcheck+">";
if(this.getText()){b=b+this.getText()
}b=b+"</textarea>";
return b
},getRows:function(){return this.rows
},setRows:function(a){this.rows=a;
this.rerender()
},getCols:function(){return this.cols
},setCols:function(a){this.cols=a;
this.rerender()
},getText:function(){return this.text
},setText:function(a){this.text=a;
if(this.text!==a){this.text="";
alert("Bad content in the textArea! TextArea's content was removed...");
this.rerender();
return
}this.rerender()
},onAfterRendering:function(){$("#"+this.getId()).bind("blur",this,function(a){a.data.setText($("#"+this.id).val(),true)
})
},});
var cVerticalLayoutControl=Class.create();
cVerticalLayoutControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.content){this.content=a.content
}else{this.content=[]
}this.contentItemStyleClass="verticalLayoutItem"
},render:function(){var b="";
b=b+"<table id="+this.id+' class="verticalLayoutControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
for(var a=0;
a<this.content.length;
a++){b=b+'<tr class="verticalLayoutControlContentItem">';
b=b+"<td>";
b=b+this.content[a].render();
b=b+"</td>";
b=b+"</tr>"
}b=b+"</table>";
return b
},removeMessages:function(){$("#"+this.getId()+" .verticalLayoutMessage").remove()
},addMessage:function(b,e){this.removeMessages();
var c=new cLabelControl(this.getId()+"Message",{text:b});
var a=new cImageControl(this.getId()+"Icon",{url:""});
var d='<tr class="verticalLayoutMessage">';
switch(e){case"E":a.setUrl("img/alert_red_16.png");
break;
case"S":a.setUrl("img/accept_16.png");
break;
case"W":a.setUrl("img/alert_orange_16.png");
break
}d=d+"<td>";
d=d+a.render();
d=d+"</td>";
d=d+"<td>";
d=d+c.render();
d=d+"</td>";
d=d+"</tr>";
$("#"+this.getId()).append(d)
},appendContent:function(b){this.content.push(b);
var a='<tr class="verticalLayoutControlContentItem">';
a=a+"<td>";
a=a+b.render();
a=a+"</td>";
a=a+"</tr>";
$("#"+this.getId()).append(a);
b._onAfterRendering(b)
},showBusyIndicator:function(){var a=new cImageControl(this.getId()+"BusyIndicator",{url:"img/busyIndicator.gif"});
var b='<tr class="verticalLayoutBusyIndicator">';
b=b+"<td>";
b=b+a.render();
b=b+"</td>";
b=b+"</tr>";
$("#"+this.getId()).append(b)
},hideBusyIndicator:function(){$("#"+this.getId()+" .verticalLayoutBusyIndicator").remove()
}});
var cVideoControl=Class.create();
cVideoControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a){if(a.src){this.src=a.src
}if(a.height){this.height=a.height
}if(a.width){this.width=a.width
}}},getSrc:function(){return this.src
},setSrc:function(a){this.src=a;
this.rerender()
},getHeight:function(){return this.height
},setHeight:function(a){this.height=a;
this.rerender()
},getWidth:function(){return this.width
},setWidth:function(a){this.width=a;
this.rerender()
},render:function(){var b="";
b=b+"<video id="+this.id+' class="videoControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'" height="'+this.height+'" width="'+this.width+'" controls>';
b=b+'<source src="'+this.src+'"type="video/mp4" ></video>';
return b
},});
var cViewControl=Class.create();
cViewControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a){if(a.content){this.content=a.content
}else{this.content=[]
}if(a.oTitle){this.oTitle=a.oTitle
}if(a.isStatic){this.isStatic=a.isStatic
}if(a.roleDependentContent===false){this.roleDependentContent=a.roleDependentContent
}else{this.roleDependentContent=true
}if(a.oAllowedRoles){this.oAllowedRoles=a.oAllowedRoles
}}},render:function(){var b="";
b="<div id="+this.id+' class="viewControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
if(this.oTitle){b=b+"<div id="+this.id+"Title class=viewControlTitle>"+this.oTitle.render()+"</div>"
}b=b+"<div id="+this.id+"Content class=viewControlContent>";
for(var a=0;
a<this.content.length;
a++){b=b+this.content[a].render()
}b=b+"</div>";
b=b+"</div>";
return b
},translate:function(b){if(b&&b.oTitle){b.oTitle.translate(b.oTitle)
}if(!b||!b.content){return
}for(var a=0;
a<b.content.length;
a++){if(b.content[a].content&&b.content[a].content.length>0){b.content[a].translate(b.content[a])
}}for(var a=0;
a<b.content.length;
a++){b.content[a].translate()
}},createContent:function(a){if(!this.getRoleDependentContent()){this._createContentForGuest();
return
}switch(a){case"Guest":this._createContentForGuest();
break;
case"Member":this._createContentForMember();
break;
case"Performer":this._createContentForPerformer();
break;
case"TechnicalAdministrator":this._createContentForTechAdmin();
break
}},_createContentForGuest:function(){},_createContentForMember:function(){},_createContentForPerformer:function(){},_createContentForTechAdmin:function(){},_createContent:function(){},_exitGuest:function(){},_exitMember:function(){},_exitPerformer:function(){},onExit:function(){},_onExit:function(a){fnExecutOnExit(this)
},getRoleDependentContent:function(){return this.roleDependentContent
},setRoleDependentContent:function(a){this.roleDependentContent=a;
this.rerender()
},getTitle:function(){return this.oTitle
},setTitle:function(a,b){this.oTitle=a;
if(b===false||b===undefined){this.rerender()
}},getTitleTextId:function(){return this.titleTextId
},setTitleTextId:function(a){this.titleTExtId=a
},onExit:function(a){},exitConfirmation:function(){return true
},onAfterRendering:function(c,b){if(!this.isStatic){var a=$("#header").height()+$("#navigationPanel").height();
a=a+$("#"+this.getId()+"Content").height()+$("#footer").height()+32;
if(a<$(window).height()){$("#contentArea").css("min-height",$("#"+this.getId()+"Content").height()+$(window).height()-a+"px")
}}if(!b){this.onViewInstanceAfterRendering()
}},onViewInstanceAfterRendering:function(){}});
var cWrapperControl=Class.create();
cWrapperControl.prototype=Object.extend(new cBasicControl(),{initialize:function(b,a){this.basicInitialize(b,a);
if(a&&a.content){this.content=a.content
}else{this.content=[]
}},render:function(){var b="";
b=b+"<div";
if(this.getId()){b=b+' id = "'+this.getId()+'"'
}b=b+' class="wrapperControl ';
for(var a=0;
a<this.styleClasses.length;
a++){b=b+this.styleClasses[a]+" "
}b=b+'">';
for(var a=0;
a<this.content.length;
a++){b=b+this.content[a].render()
}b=b+"</div>";
return b
},onClick:function(d,b){var c=this;
var a=this.onAfterRendering;
this.onAfterRendering=function(){a(c);
$("#"+c.id).unbind();
$("#"+c.id).bind("click",d,function(){b(d)
})
}
},});
