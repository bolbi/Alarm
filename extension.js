const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Gettext = imports.gettext;
const MessageTray = imports.ui.messageTray;

const _ = Gettext.gettext;

function _myNotify(text)
{
	global.log("_myNotify called: " + text);

	let source = new MessageTray.SystemNotificationSource();
	Main.messageTray.add(source);
	let notification = new MessageTray.Notification(source, text, null);
	notification.setTransient(true);
	source.notify(notification);
}

function _myButton() {
	this._init();
}

_myButton.prototype = {
__proto__: PanelMenu.Button.prototype,

	   _init: function() {
		   PanelMenu.Button.prototype._init.call(this, 0.0);
		   this._label = new St.Label({ style_class: 'panel-label', text: _("0s") });
		   this.actor.set_child(this._label);
		   Main.panel._centerBox.add(this.actor, { y_fill: true });
		   this._add(10, "Super-short tea");
		   this._add(300, "Black tea");
		   this._resetLabel();
	   },

_resetLabel: function() {
		     this._label.set_text("Make a tea!");
	     },

_add: function(time, desc) {
	      _myMenu = new PopupMenu.PopupMenuItem(desc+" ("+time+" s)");
	      this.menu.addMenuItem(_myMenu);
	      f = Lang.bind(this, this._showHello);
	      _myMenu.connect('activate', function() { f(time);});
      },

_tick: function(n) {
	       if(n==0) {
		       _myNotify("Your tea is ready!");
		       this._resetLabel();
	       }
	       else {
		       this._label.set_text(n+" s");
		       Mainloop.timeout_add(1000, Lang.bind(this, this._tick, n-1));
	       }
       },

_onDestroy: function() {},

	    _showHello: function(n) {
		    global.log("_showHello: "+n);
		    this._tick(n);
	    }
};

function main(extensionMeta) {

    let userExtensionLocalePath = extensionMeta.path + '/locale';
    Gettext.bindtextdomain("helloworld", userExtensionLocalePath);
    Gettext.textdomain("helloworld");

    let _myPanelButton = new _myButton();
}
