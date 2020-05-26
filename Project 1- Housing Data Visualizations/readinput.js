function loadData(variable)
{
	var lines = [];
	d3.csv("Data.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
    	lines.push(data[i]);
    }
    csvdata = lines;
    console.log(csvdata);
    createClickHandler(variable,numbins);   
	});
}

function MSZoningFn() {
	if(isdataloaded)
	{
		createClickHandler("MSZoning");   
	}
	else
	{		
		loadData("MSZoning");
		isdataloaded = true;
	}
	currentselectedelement = "MSZoning";
}

function NeighborhoodFn()
{
	if(isdataloaded)
	{
		createClickHandler("Neighborhood");   
	}
	else
	{		
		loadData("Neighborhood");
		isdataloaded = true;
	}
	currentselectedelement = "Neighborhood";
}

function BldgTypeFn()
{
	if(isdataloaded)
	{
		createClickHandler("BldgType");   
	}
	else
	{		
		loadData("BldgType");
		isdataloaded = true;
	}
	currentselectedelement = "BldgType";
}

function HouseStyleFn()
{
	if(isdataloaded)
	{
		createClickHandler("HouseStyle");   
	}
	else
	{		
		loadData("HouseStyle");
		isdataloaded = true;
	}
	currentselectedelement = "HouseStyle";
}


function RoofStyleFn()
{
	if(isdataloaded)
	{
		createClickHandler("RoofStyle");   
	}
	else
	{		
		loadData("RoofStyle");
		isdataloaded = true;
	}
	currentselectedelement = "RoofStyle";
}

function SaleConditionFn()
{
	if(isdataloaded)
	{
		createClickHandler("SaleCondition");   
	}
	else
	{		
		loadData("SaleCondition");
		isdataloaded = true;
	}
	currentselectedelement = "SaleCondition";
}

function FoundationFn()
{
	if(isdataloaded)
	{
		createClickHandler("Foundation");   
	}
	else
	{		
		loadData("Foundation");
		isdataloaded = true;
	}
	currentselectedelement = "Foundation";
}


function Exterior1stFn()
{
	if(isdataloaded)
	{
		createClickHandler("Exterior1st");   
	}
	else
	{		
		loadData("Exterior1st");
		isdataloaded = true;
	}
	currentselectedelement = "Exterior1st";
}

function OverallCondFn() {
	if(isdataloaded)
	{
		createClickHandler("OverallCond",numbins);   
	}
	else
	{		
		loadData("OverallCond");
		isdataloaded = true;		
	}
	currentselectedelement = "OverallCond";
}

function BedroomAbvGrFn() {
	if(isdataloaded)
	{
		createClickHandler("BedroomAbvGr",numbins);   
	}
	else
	{		
		loadData("BedroomAbvGr");
		isdataloaded = true;		
	}
	currentselectedelement = "BedroomAbvGr";
}

function valFn() {
	if(isdataloaded)
	{
		createClickHandler("MSSubClass",numbins);   
	}
	else
	{		
		loadData("MSSubClass");
		isdataloaded = true;		
	}
	currentselectedelement = "MSSubClass";
}

function TotRmsAbvGrdFn() {
	if(isdataloaded)
	{
		createClickHandler("TotRmsAbvGrd",numbins);   
	}
	else
	{		
		loadData("TotRmsAbvGrd");
		isdataloaded = true;		
	}
	currentselectedelement = "TotRmsAbvGrd";
}

function GarageAreaFn() {
	if(isdataloaded)
	{
		createClickHandler("GarageArea",numbins);   
	}
	else
	{		
		loadData("GarageArea");
		isdataloaded = true;		
	}
	currentselectedelement = "GarageArea";
}

function SalePriceFn() {
	if(isdataloaded)
	{
		createClickHandler("SalePrice",numbins);   
	}
	else
	{		
		loadData("SalePrice");
		isdataloaded = true;		
	}
	currentselectedelement = "SalePrice";
}

function PoolAreaFn() {
	if(isdataloaded)
	{
		createClickHandler("GarageCars",numbins);   
	}
	else
	{		
		loadData("GarageCars");
		isdataloaded = true;		
	}
	currentselectedelement = "GarageCars";
}

function GrLivAreaFn() {
	if(isdataloaded)
	{
		createClickHandler("GrLivArea",numbins);   
	}
	else
	{		
		loadData("GrLivArea");
		isdataloaded = true;		
	}
	currentselectedelement = "GrLivArea";
}
