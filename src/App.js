import React from 'react';
import Footer from'./Footer';
import default_usa_link from'./static/default_usa_link';
import bardatajson from'./static/bardatajson';
import MapChart from'./MapChart';
import BarChart from'./BarChart';
import{ BrowserRouter as Router, Route }from 'react-router-dom';

import * as d3 from 'd3';
import DonutChart from './DonutChart';
import ThreeJSChart from './ThreeJSChart';

const centroids = new Array();
const mapRoutes = new Array();
const yearData = {};
const countries = {
	BE: 'Belgium',
	BG: 'Bulgaria',
	CZ: 'Czech Republic',
	DK: 'Denmark',
	DE: 'Germany',
	EE: 'Estonia',
	IE: 'Ireland',
	GR: 'Greece',
	GB: 'Great Britain',
	ES: 'Spain',
	FR: 'France',
	HR: 'Croatia',
	IT: 'Italy',
	CY: 'Cyprus',
	LV: 'Latvia',
	LT: 'Lithuania',
	LU: 'Luxemburg',
	HU: 'Hungaria',
	MT: 'Malta',
	NL: 'Netherlands',
	AT: 'Austria',
	PL: 'Poland',
	PT: 'Portugal',
	RO: 'Romania',
	SI: 'Slovenia',
	SK: 'Slovakia',
	FI: 'Finland',
	SE: 'Sweden',
	CA: 'Canada',
	US: 'United States',
	ZA: 'South Africa',
	VN: 'Vietnam',
	KE: 'Kenya',
	IN: 'India',
	CO: 'Colombia',
	AR: 'Argentina'
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
		this.state = {
			mapCountries: [],
			mapCountry: 'BE',
			threeMapCountry: 'ke',
			mapYear: 2013,
			barCountry: 'AR',
			barYear: 2014,
			countryFormal: 'United States',
			num_links: [248],
			centroid: [-93, 33],
			trade_links: default_usa_link,
			trade_comps: [
				{ value: 6.2, label: 'Growth rate of SMEs using PayPal', color: '#ccc'},
				{ value: -9.9, label: 'Growth rate of total offline exports', color: '#ccc' },
				{ value: -9.1, label: 'Growth rate of PayPal mirror basket of offline exports', color: '#ccc' },
				{ value: 1, label: 'GDP growth rate (Latin America & Caribbean)', color: '#ccc' },
				{ value: 2.9, label: 'GDP growth rate (world)', color: '#009cec' },
			],
			width: 0, 
			height: 0,
			mobile: false,
			currentIndex: 0,
			rurals: [
				{
					image1: 'image/eu14.png',
					image2: 'image/eu12.png',
					percent1: 14,
					percent2: 12,
					color: '#0064c7',
					text: 'For 2015-2017, Urban PayPal merchants grew at very similar rates as merchants using PayPal in rural areas.',
					country: 'European Union'
				},
				{
					image1: 'image/us33.png',
					image2: 'image/us32.png',
					percent1: 33.6,
					percent2: 32.1,
					color: '#009cec',
					text: 'From 2015-2016, heartland exporters had slightly higher growth rates than those located on the coasts.',
					country: 'United States'
				},
				{
					image1: 'image/ca21.png',
					image2: 'image/ca18.png',
					percent1: 21,
					percent2: 18,
					color: '#273299',
					text: 'Small businesses using PayPal located in rural parts of Canada grew about 18 per cent between 2016 and 2017, while urban businesses grew about 21 per cent.',
					country: 'Canada'
				},
			],
			threeCountries: {
				ke: {code: 'ke', height: 17, name: 'Kenya', zoom: 17, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 17 times.'},
				vn: {code: 'vn', height: 9, name: 'Vietnam', zoom: 13, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 9 times.'},
				co: {code: 'co', height: 2.2, name: 'Colombia', zoom: 10, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 6.2 times.'},
				sa: {code: 'sa', height: 3.4, name: 'South Africa', zoom: 10, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 5.9 times.'},
				in: {code: 'in', height: 5.9, name: 'India', zoom: 8, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 3.4 times.'},
				ar: {code: 'ar', height: 6.2, name: 'Argentina', zoom: 7, detail: 'Between 2013-2017, exports by small businesses on the PayPal platform grew by more than 2.2 times.'},
			},
			showTooltip: false,
			showBarTooltip: false,
			barTooltipLeft: 0,
			barTooltipTop: 0,
			barTooltipText: '',
			showMapTooltip: false,
			mapTooltipLeft: 0,
			mapTooltipTop: 0,
			mapTooltipText: '',
		};
		this.percent1Val = 0;
		this.percent2Val = 0;

		this.onMapSelect = this.onMapSelect.bind(this);
		this.onMapCountry = this.onMapCountry.bind(this);
		this.onMapYear = this.onMapYear.bind(this);
		this.onBarSelect = this.onBarSelect.bind(this);
		this.onBarCountry = this.onBarCountry.bind(this);
		this.onBarYear = this.onBarYear.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.on3DMapCountry = this.on3DMapCountry.bind(this);
		this.slideCountry = this.slideCountry.bind(this);
		this.showTooltip = this.showTooltip.bind(this);
		this.showBarTooltip = this.showBarTooltip.bind(this);
		this.hideBarTooltip = this.hideBarTooltip.bind(this);
		this.showMapTooltip = this.showMapTooltip.bind(this);
		this.hideMapTooltip = this.hideMapTooltip.bind(this);
		d3.csv("Book.csv", function(data) {
			centroids.push(data); 
		});

		const that = this;
		d3.csv('map-routes.csv', function(d, index) {
			mapRoutes.push(d);
			if (index === 29940) {
				const mapCountries = [];
				mapRoutes.forEach(m => {
					if (mapCountries.indexOf(m.Merchant) < 0 && m.Merchant) {
						mapCountries.push(m.Merchant);
					}
					if (m.Value) {
						if (yearData[m.Year]) {
							if (yearData[m.Year]["links"][m.Merchant]) {
								yearData[m.Year]["links"][m.Merchant].push({
									country: m.Buyer,
									value: m.Value
								});
							} else {
								yearData[m.Year]["links"][m.Merchant] = [{
									country: m.Buyer,
									value: m.Value
								}];
							}
						} else {
							yearData[m.Year] = {links: {[m.Merchant]: [{
								country: m.Buyer,
								value: m.Value
							}]}};
						}
					}
				});
				that.setState({mapCountries: mapCountries});
				that.onMapSelect(2013, that.state.mapCountry);
			}
		});
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		this.percent1(this.state.rurals[this.state.currentIndex].percent1);
		this.percent2(this.state.rurals[this.state.currentIndex].percent2);
	}

	componentWillUnmount() {
	 	window.removeEventListener('resize', this.updateWindowDimensions);
	}

	percent1(val) {
		const that = this;
		const percent1Timer = setInterval(() => {
			that.percent1Val += 0.1;
			document.getElementById("percent1").innerHTML = (that.percent1Val).toFixed(1) + ' <span>%</span>';
			if (that.percent1Val > val) {
				clearInterval(percent1Timer);
			}
		}, 1);
	}

	percent2(val) {
		const that = this;
		const percent2Timer = setInterval(() => {
			that.percent2Val += 0.1;
			document.getElementById("percent2").innerHTML = (that.percent2Val).toFixed(1) + ' <span>%</span>';
			if (that.percent2Val > val) {
				clearInterval(percent2Timer);
			}
		}, 1);
	}

	updateWindowDimensions() {
		if (window.innerWidth < 767) { 
			this.setState({ mobile: true }) 
		} else {
			this.setState({ mobile: false }) 
		};
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	play() {
        this.slider.slickPlay();
    }

	pause() {
		this.slider.slickPause();
	}

	onMapSelect(currentYear, currentMapCountry) {
		let center = [-93, 33];
		let trade_links = [];
		let num_links = 0;
		let countryFormal = '';
		let year = currentYear;
		let mapCountry = currentMapCountry;

	    centroids.forEach(function(item) {
			if ( item.country === mapCountry ) {
				center = [item.longitude, item.latitude];
			}
		});
		
		for (let y in yearData) {
			if (y === year.toString()) {
				for (let key in yearData[y].links) {
					if (key === mapCountry) {
						countryFormal = countries[key];
						num_links = yearData[y].links[key].length;
						yearData[y].links[key].forEach(link => {
							centroids.forEach(function (item) {
								var coords = {};
								if (item.country === link.country) {
									coords.coordinates = [item.longitude, item.latitude];
									coords.value = link.value;
									coords.country = item.name;
									trade_links.push(coords);
								}
							});
						});
					}
				}
			}
		}

		this.setState({
			countryFormal: countryFormal,
			num_links: num_links,
			centroid: center,
			trade_links: trade_links,
		});
	};

	onMapYear(year) {
	    this.setState({
			  mapYear: year,
			  showTooltip: false
	    });
	    this.onMapSelect(year, this.state.mapCountry);
	}

	onMapCountry = event => {
	    this.setState({
			  mapCountry: event.target.value,
			  showTooltip: false
	    });
	    this.onMapSelect(this.state.mapYear, event.target.value);
	}

	on3DMapCountry = event => {
	    this.setState({
	      	threeMapCountry: event.target.value.toLowerCase(),
	    });
	}

	onBarSelect(currentYear, currentBarCountry) {
		let year = currentYear;
		let barCountry = currentBarCountry;
		let comps = [];

	    bardatajson.forEach(function (data) {
			if (parseInt(data.year) === year) {
				data.comp_data.forEach(function (data) {
					if (data.country === barCountry) {
						comps = data.comps;
					}
				});
			}
		});

	    this.setState({
	      	trade_comps: comps,
	    });
	};

	onBarYear(year) {
		this.setState({
			barYear: year
		});
		this.onBarSelect(year, this.state.barCountry);
	}

	onBarCountry = event => {
	    this.setState({
	      	barCountry: event.target.value,
	    });
	    this.onBarSelect(this.state.barYear, event.target.value);
	}

	slide(direction) {
		this.percent1Val = 0;
		this.percent2Val = 0;
		if (direction === 'left') {
			if (this.state.currentIndex !== 0) {
				this.setState({currentIndex: this.state.currentIndex - 1});
				this.percent1(this.state.rurals[this.state.currentIndex - 1].percent1);
				this.percent2(this.state.rurals[this.state.currentIndex - 1].percent2);
			} else {
				this.setState({currentIndex: 2});
				this.percent1(this.state.rurals[2].percent1);
				this.percent2(this.state.rurals[2].percent2);
			}
		} else {
			if (this.state.currentIndex !== 2) {
				this.setState({currentIndex: this.state.currentIndex + 1});
				this.percent1(this.state.rurals[this.state.currentIndex + 1].percent1);
				this.percent2(this.state.rurals[this.state.currentIndex + 1].percent2);
			} else {
				this.setState({currentIndex: 0});
				this.percent1(this.state.rurals[0].percent1);
				this.percent2(this.state.rurals[0].percent2);
			}
		}
	}

	slideCountry(direction) {
		switch(this.state.threeMapCountry) {
			case 'ke':
				direction === 'left' ? this.setState({threeMapCountry: 'ar'}) : this.setState({threeMapCountry: 'vn'});
			break;
			case 'vn':
				direction === 'left' ? this.setState({threeMapCountry: 'ke'}) : this.setState({threeMapCountry: 'co'});
			break;
			case 'co':
				direction === 'left' ? this.setState({threeMapCountry: 'vn'}) : this.setState({threeMapCountry: 'sa'});
			break;
			case 'sa':
				direction === 'left' ? this.setState({threeMapCountry: 'co'}) : this.setState({threeMapCountry: 'in'});
			break;
			case 'in':
				direction === 'left' ? this.setState({threeMapCountry: 'sa'}) : this.setState({threeMapCountry: 'ar'});
			break;
			case 'ar':
				direction === 'left' ? this.setState({threeMapCountry: 'in'}) : this.setState({threeMapCountry: 'ke'});
			break;
		}
	}

	showTooltip(flag) {
		this.setState({showTooltip: flag});
	}

	showBarTooltip(x, y, text) {
		this.setState({
			showBarTooltip: true,
			barTooltipLeft: x,
			barTooltipTop: y,
			barTooltipText: text
		});
	}

	hideBarTooltip() {
		this.setState({showBarTooltip: false});
	}

	showMapTooltip(x, y, text) {
		this.setState({
			showMapTooltip: true,
			mapTooltipLeft: x,
			mapTooltipTop: y,
			mapTooltipText: text
		});
	}

	hideMapTooltip() {
		this.setState({showMapTooltip: false});
	}
	
	render() { 
		return(
		<div className="whole">
			<Router>
				<div className="page-sec"> 
					<section id="first_sec" className="sec_first" height={this.state.height}>
						<div className="logo-div">
							<a href="https://www.paypal.com/us/home"><img className="papl-logo" src="image/paypal_logo.png" /></a>
							<p><span>DOWNLOAD REPORTS:</span> <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/PayPal-Policy-Paper_Democratizing-Globalization.pdf" target="_blank">U.S.</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/Digital-Commerce-How-Canadian-Businesses-are-Growing-and-Trading-Internationally.pdf" target="_blank">Canada</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/Small_Business_Growth_in_Europe.pdf" target="_blank">Europe</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/PayPal_SME-Cross-Border-Trade-Emerging-Markets.pdf" target="_blank">Emerging Markets</a></p>
						</div>
						<div className="wrapper">
							<div className="container-fluid background">
								<div className="row">
									<div className="col-sm-12 col-lg-6 full_watch">
										<div className="title">Inclusive Globalization</div>
										<div className="watch_text">
											Watch how small businesses around the world are participating in cross-border trade on the PayPal platform.
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="scroll_btn">
							<a href="#third_sec">
								<span>Scroll to continue</span><br/>
								<img width="25" src="image/scroll_one.png" />
							</a>
						</div>
					</section>
					<section id="third_sec" className="sec_third" height={this.state.height}>
						<div className="wrapper" height={this.state.height*0.9}>
							<div className="row map mb-4">
								<div className="col-md-6 cont_textprt map_text whitebg">
									<div className="cntbr_txt">
										<div className="section_num">1</div>
										<div className="bar_text">
											Trade corridors
										</div>
									</div>
								</div>
								<div className="col-md-6 map_prt" >
									<div className="select_option">
										<span className="fancyArrow"></span>
										<select 
											className="cntry_slct" 
											onChange={this.onMapCountry}>
											{
												Object.keys(countries).map(code => <option value={code} key={code}>{countries[code]}</option>)
											}
										</select>
									</div>
								</div>
							</div>
							<div className="row map-section">
								<div className="col-12 col-lg-11">
									<div className="smap" height={this.state.height*0.7}>
										<div className="map-tooltip" style={{'display': this.state.showMapTooltip ? 'block' : 'none', 'left': this.state.mapTooltipLeft, 'top': this.state.mapTooltipTop}}>
											{this.state.mapTooltipText}
										</div>
										<div className="unavailableText">Data is unavailable for year {this.state.mapYear}</div>
										<svg height={this.state.height*0.65}>
											<MapChart
												showMapTooltip={this.showMapTooltip}
												hideMapTooltip={this.hideMapTooltip}
												tooltipFlag={this.state.showTooltip}
												showTooltip={(flag) => this.showTooltip(flag)}
												selectedCountry={this.state.mapCountry}
												center={this.state.centroid}
												trade_links={this.state.trade_links}
												width={this.state.width} 
												year={this.state.mapYear}
												height={this.state.height*0.6}
											/>
										</svg>
									</div>
								</div>
								<div className="col-12 col-lg-1 slider_whole_dot_map">
									<a className={this.state.mapYear === 2013 ? "button frst_sld selected" : "button frst_sld"} value={2013} onClick={() => this.onMapYear(2013)}>
									<div className="year_dot_map">2013</div>           
									</a>
									<a className={this.state.mapYear === 2014 ? "button frst_sld selected" : "button frst_sld"} value={2014} onClick={() => this.onMapYear(2014)}>
									<div className="year_dot_map">2014</div> 
									</a>
									<a className={this.state.mapYear === 2015 ? "button frst_sld selected" : "button frst_sld"} value={2015} onClick={() => this.onMapYear(2015)}>
									<div className="year_dot_map">2015</div> 
									</a>
									<a className={this.state.mapYear === 2016 ? "button frst_sld selected" : "button frst_sld"} value={2016} onClick={() => this.onMapYear(2016)}>
									<div className="year_dot_map">2016</div> 
									</a>
									<a className={this.state.mapYear === 2017 ? "button frst_sld selected" : "button frst_sld"} value={2017} onClick={() => this.onMapYear(2017)}>
									<div className="year_dot_map">2017</div> 
									</a>
								</div>
								{
									this.state.countryFormal && this.state.showTooltip ? <div className="map_notification mHide" style={{backgroundImage: "url(image/notifi.png)"}}>
										<p className="map_note_text">{this.state.countryFormal} had {this.state.trade_links.length} trade partners in {this.state.mapYear}</p>
									</div> : null
								}
							</div>
						</div>
						<div className="scrollNext" height={this.state.height*0.1}>
							<div className="col-sm-12 scroll_cntnu">
								<div className="scroll_text">The number of trade corridors connecting small businesses using PayPal <br/>to the rest of the world has been growing.</div>
							</div>
						</div>
						<a className="scroll_icon" href="#second_sec"><img width="25" src="image/scroll_one.png" /></a>
					</section>
					<section id="second_sec" className="sec_second" height={this.state.height}>
						<div className="wrapper" height={this.state.height*0.9}>
							<div className="row">
								<div className="col-xs-12 col-sm-12 col-md-6 cont_prt">
									<div className="cntbr_txt">
										<div className="section_num">2</div>
										<div className="bar_text">
											Export YOY Growth Rate
										</div>
									</div>
								</div>
								<div className=" col-sm-12 col-md-6 select_sprt">
									<div className="select_option">
										<span className="fancyArrow"></span>
										<select className="graph_cntry_slct" onChange={this.onBarCountry}>
											<option value="AR">Argentina</option>
											<option value="CO">Colombia</option>
											<option value="IN">India</option>
											<option value="KE">Kenya</option>
											<option value="SA">South Africa</option>
											<option value="VN">Vietnam</option>
										</select>
									</div>
								</div>
							</div>
							<div className="row bargraph">
								<div className="col-12 col-lg-11 bar_prt">
									<div className="sme_bar_graph" height={this.state.height*0.7}>
										<div className="bar-tooltip" style={{'display': this.state.showBarTooltip ? 'block' : 'none', 'left': this.state.barTooltipLeft + 'px', 'top': this.state.barTooltipTop + 'px'}}>
											{this.state.barTooltipText}
										</div>
										<svg 
											className="sme_svg" 
											height={this.state.height*0.67} 
											width={this.state.mobile ? this.state.width*0.9 : this.state.width*0.7}>
											<BarChart  
												showBarTooltip={this.showBarTooltip}
												hideBarTooltip={this.hideBarTooltip}
												width={this.state.mobile ? this.state.width*0.9 : this.state.width*0.7} 
												height={this.state.height*0.5}
												comps={this.state.trade_comps}
											/>
										</svg>
									</div>
								</div>
								<div className="col-12 col-lg-1 slider_whole_dot_map">
									<a className={this.state.barYear === 2014 ? "button frst_sld selected" : "button frst_sld"} value={2014} onClick={() => this.onBarYear(2014)}>
										<div className="year_dot_map">2014</div> 
									</a>
									<a className={this.state.barYear === 2015 ? "button frst_sld selected" : "button frst_sld"} value={2015} onClick={() => this.onBarYear(2015)}>
										<div className="year_dot_map">2015</div> 
									</a>
									<a className={this.state.barYear === 2016 ? "button frst_sld selected" : "button frst_sld"} value={2016} onClick={() => this.onBarYear(2016)}>
										<div className="year_dot_map">2016</div> 
									</a>
									<a className={this.state.barYear === 2017 ? "button frst_sld selected" : "button frst_sld"} value={2017} onClick={() => this.onBarYear(2017)}>
										<div className="year_dot_map">2017</div> 
									</a>
								</div>
							</div>
						</div>
						<div className="scrollNext" height={this.state.height*0.1}>
							<div className="col-sm-12 scroll_cntnu">
								<div className="scroll_text">Between 2013 and 2017, exports by small businesses using PayPal <br/>in key emerging markets grew much more than their offline counterparts.</div>
							</div>
						</div>
						<a className="scroll_icon" href="#overall_sec"><img width="25" src="image/scroll_one.png" /></a>
					</section>
					<section id="overall_sec" className="sec_fourth" height={this.state.height}>
						<div className="wrapper" height={this.state.height*0.9}>
							<div className="row map">
								<div className="col-md-6 cont_textprt map_text whitebg">
									<div className="cntbr_txt">
										<div className="section_num">3</div>
										<div className="bar_text">
											Export Growth Multiples
										</div>
									</div>
								</div>
								<div className="col-md-6 map_prt" >
									<div className="select_option">
										<span className="fancyArrow"></span>
										<select
											value={this.state.threeMapCountry}
											className="cntry_slct" 
											onChange={this.on3DMapCountry}>
											<option value="ke">Kenya</option>
											<option value="vn">Vietnam</option>
											<option value="co">Colombia</option>
											<option value="sa">South Africa</option>
											<option value="in">India</option>
											<option value="ar">Argentina</option>
										</select>
									</div>
								</div>
								<div className="col-md-12 overall-section">
									<div className="d-flex align-items-center text-center">
										<a className="btn-arrow-left" onClick={() => this.slideCountry('left')}><img src="image/arrow_left.png" /></a>
										<div className="row">
											<div className="col-md-12 text-center">
												<ThreeJSChart width={this.state.width > 800 ? this.state.width - 400 : this.state.width} country={this.state.threeCountries[this.state.threeMapCountry]}></ThreeJSChart>
											</div>
											<div className="col-md-12 donut-text-section text-center">
												<h3>{this.state.threeCountries[this.state.threeMapCountry].name}</h3>
												<p>{this.state.threeCountries[this.state.threeMapCountry].detail}</p>
											</div>
										</div>
										<a className="btn-arrow-right" onClick={() => this.slideCountry('right')}><img src="image/arrow_right.png" /></a>
									</div>
								</div>
							</div>
						</div>
						<a className="scroll_icon" href="#rural_sec"><img width="25" src="image/scroll_one.png" /></a>
					</section>
					<section id="rural_sec" className="sec_fourth" height={this.state.height}>
						<div className="wrapper" height={this.state.height*0.9}>
							<div className="row map">
								<div className="col-md-6 cont_textprt map_text whitebg">
									<div className="cntbr_txt">
										<div className="section_num">4</div>
										<div className="bar_text">
											Rural vs urban
										</div>
									</div>
								</div>
								<div className="col-md-12 rural-content">
									<div className="d-flex align-items-center text-center pie-section">
										<a className="btn-arrow-left" onClick={() => this.slide('left')}><img src="image/arrow_left.png" /></a>
										<div className="row rural-slider">
											<div className="col-md-6 text-right">
												<div className="donut-container">
													<div className="text-center donut-percent" id="percent1"></div>
													<DonutChart image={this.state.rurals[this.state.currentIndex].image1} className="donut1" percent={this.state.rurals[this.state.currentIndex].percent1} color={this.state.rurals[this.state.currentIndex].color}></DonutChart>
												</div>
											</div>
											<div className="col-md-6 text-left">
												<div className="donut-container">
													<div className="text-center donut-percent" id="percent2"></div>
													<DonutChart image={this.state.rurals[this.state.currentIndex].image2} className="donut2" percent={this.state.rurals[this.state.currentIndex].percent2} color={this.state.rurals[this.state.currentIndex].color}></DonutChart>
												</div>
											</div>
											<div className="col-md-12 donut-text-section text-center">
												<h3>{this.state.rurals[this.state.currentIndex].country}</h3>
												<p>{this.state.rurals[this.state.currentIndex].text}</p>
											</div>
										</div>
										<a className="btn-arrow-right" onClick={() => this.slide('right')}><img src="image/arrow_right.png" /></a>
									</div>
								</div>
							</div>
						</div>
						<a className="scroll_icon" href="#fourth_sec"><img width="25" src="image/scroll_one.png" /></a>
					</section>
					<section id="fourth_sec" className="sec_fourth">
						<Route exact path='/' component={Footer} />
					</section>
				</div>
			</Router> 
		</div>
		);
	}
}
export default App;