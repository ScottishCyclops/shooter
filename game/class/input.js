class Input
{
	constructor(player)
	{
		this.controls =
	    {
	        "UP":       {"CODE": 87, "DOWN": false}, //w
	        "LEFT":     {"CODE": 65, "DOWN": false}, //a
	        "RIGHT":    {"CODE": 68, "DOWN": false}, //s
	        "DOWN":     {"CODE": 83, "DOWN": false}, //d
	        "SHOOT":    {"BUTTON": LEFT, "DOWN": false}, //left mouse button

	        "MELEE":    {"CODE": 70}, //function() {}
	        "GRENADE":  {"CODE": 81}, //q
	        "RELOAD":   {"CODE": 82}, //r
	        "HEAL":     {"CODE": 69}, //e
	        "WEAPON_1": {"CODE": 49}, //1
	        "WEAPON_2": {"CODE": 50}, //2
	        "WEAPON_3": {"CODE": 51} //3
	    };
	}

	updateKeys(code, pressing)
	{
	    switch(code)
	    {
	        case this.controls["UP"]["CODE"]:    this.controls["UP"]["DOWN"] =    pressing; break;
	        case this.controls["LEFT"]["CODE"]:  this.controls["LEFT"]["DOWN"] =  pressing; break;
	        case this.controls["RIGHT"]["CODE"]: this.controls["RIGHT"]["DOWN"] = pressing; break;
	        case this.controls["DOWN"]["CODE"]:  this.controls["DOWN"]["DOWN"] =  pressing; break;

	        case this.controls["MELEE"]["CODE"]:    player.meleeAttack();     break;
	        case this.controls["GRENADE"]["CODE"]:  player.throwGrenade();    break;
	        case this.controls["RELOAD"]["CODE"]:   player.reloadWeapon();    break;
	        case this.controls["HEAL"]["CODE"]:     player.useMedkit();       break;
	        case this.controls["WEAPON_1"]["CODE"]: player.switchToWeapon(1); break;
	        case this.controls["WEAPON_2"]["CODE"]: player.switchToWeapon(2); break;
	        case this.controls["WEAPON_3"]["CODE"]: player.switchToWeapon(3); break;
	    }
	}

	updateButtons(code, pressing)
	{
	    switch(code)
	    {
	        case this.controls["SHOOT"]["BUTTON"]: this.controls["SHOOT"]["DOWN"] = pressing; break;
	    }
	}
}