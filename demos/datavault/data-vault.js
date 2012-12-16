/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Definition of svg groups to be used in slides of presentation
 *
 ******************************************************************************/

var presentation = {
/*
	sn : ['Gegevens Magazijn Concept'
		, 'bronhouders'
		, 'communicatie-invoer'
		, 'communicatie-uitvoer'
		, 'GUC'
		, 'guc communicatie'
		], */
	title: 'Data Vault Gegevensmagazijn', 
	slides: new Array(),
	initSlides: function(evt) {
		this.slides = [
			{ layers:["titles","titles-1"]
			, display:"frame-totaal"
			, notes:"Overzicht van de basisconcepten van Data-Vault modelling."
			, title:"Introductie Data Vault modelling" 
			}, 
			{ layers:["titles","titles-1","titles-2"]
			, display:"frame-totaal"
			, notes:"Een voorbeeld gebasseerd op het Rotterdams GegevensMagazijn voor basis- en kern-gegevens. (Echte implementatie wijkt dus af.)"
			, title:"Introductie Data Vault modelling" 
			},
			/******** Hub ************/
			{ layers:["Hubs","Persoon"]
			, display:"frame-totaal"
			, notes:"Hubs modelleren real-world enititeiten. Bijvoorbeeld een persoon"
			, title:"Persoon hub" 
			},
			{ layers:["Hubs","Persoon","Adres"]
			, display:"frame-totaal"
			, notes:"Adres is ook een voorbeeld van een Hub"
			, title:"Adres hub" 
			},
			{ layers:["Hubs","Persoon","Adres","hub-comment"]
			, display:"frame-totaal"
			, notes:"Hubs modelleren real-world enititeiten."
			, title:"Real-world entiteiten" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr"]
			, display:"frame-persoon"
			, notes:"Hubs registreren slechts business-keys"
			, title:"Hub attributen" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","persoon-hub-attr-comment"]
			, display:"frame-persoon"
			, notes:"Binnen gemeentelijke levering van Bronhouders naar Afnemers"
			, title:"Binnengemeentelijke levering" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr"]
			, display:"frame-adres"
			, notes:"Binnen gemeentelijke levering van Bronhouders naar Afnemers"
			, title:"Binnengemeentelijke levering" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","adres-hub-attr-comment"]
			, display:"frame-adres"
			, notes:"Binnen gemeentelijke levering van Bronhouders naar Afnemers"
			, title:"Binnengemeentelijke levering" 
			},
			/******** Link ************/
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"]
			, display:"frame-woonadres"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr","link-comment"]
			, display:"frame-woonadres"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			/******** Satellite ************/
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr"]
			, display:"frame-persoon-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr","persoon-satellite-comment-1"]
			, display:"frame-persoon-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr"
					,"persoon-satellite-comment-1","persoon-satellite-comment-2"]
			, display:"frame-persoon-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr"
					,"persoon-satellite-comment-1","persoon-satellite-comment-2","persoon-satellite-comment-3"]
			, display:"frame-persoon-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"]
			, display:"frame-adres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
					,"adres-satellite-comment-1"
					]
			, display:"frame-adres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
					,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
					,"adres-satellite-comment-1","adres-satellite-comment-2"
					]
			, display:"frame-adres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite"]
			, display:"frame-woonadres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr"]
			, display:"frame-woonadres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr","woonadres-satellite-comment-1"]
			, display:"frame-woonadres-satellite"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			/******** Voordelen ************/
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr"
				,"voordelen"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr"
				,"voordelen","voordeel-1"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr"
				,"voordelen","voordeel-2"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
			{ layers:["Hubs","Persoon","Adres","persoon-hub-attr","adres-hub-attr","Links","woonadres-link-attr"
				,"Satellites","persoon-satellite","persoon-satellite-attr","adres-satellite","adres-satellite-attr"
				,"woonadres-satellite","woonadres-satellite-attr"
				,"voordelen","voordeel-3"]
			, display:"frame-totaal"
			, notes:"Snel kunnen toevoegen van Bronhouders en afnemers"
			, title:"Doelen Rotterdam - Flexibiliteit" 
			},
		];
		svgPresenter.init(this.slides,this.title);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

