import React from 'react';

class Footer extends React.Component {
    render(){
        return(
			<div className="footer-sec">
				<section id="top_footer_section" className="footer_top">
					<div className="container-fluid top-footer-contain">
						<div className="row custom_row_margin">
							<div className="footer_bar">
								<div className="fbar_text">Data visualizations based on our expanding paper series on small business participation in cross-border trade:</div>
							</div>
						</div>
						<div className="row top-three">
							<div className="col-md-12 top_fcolumn">
								<div className="lorem-text">
									<p><a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/PayPal-Policy-Paper_Democratizing-Globalization.pdf" target="_blank">U.S.</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/Digital-Commerce-How-Canadian-Businesses-are-Growing-and-Trading-Internationally.pdf" target="_blank">Canada</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/Small_Business_Growth_in_Europe.pdf" target="_blank">Europe</a> | <a href="https://publicpolicy.paypal-corp.com/sites/default/files/policy/PayPal_SME-Cross-Border-Trade-Emerging-Markets.pdf" target="_blank">Emerging Markets</a></p>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="bottom_footer_section" className="footer_bottom">
					<div className="container-fluid bottom-fcontainer">
						<div className="fsingle_line ml-3"></div>
						<div className="row">
							<div className="col-xs-12 col-md-6 p-0">
								<div className="love_txt">The definition of SMEs, or micro, small, and medium enterprises (MSMEs), varies widely across entities and jurisdictions. In the interest of consistency and for the purpose of comparability across regions in research analysis, this paper series defines small businesses as businesses with an annual total payment volume of between USD 30,000 and USD 3 million on the PayPal platform.</div>
							</div>
						</div>
						<div className="row feed_other">
							<div className="col-xs-12 col-sm-12 col-md-6 bottom_one">
								<div className="three_sec">
									<div className="two-set">
										<div className="iuv_info">
											<div className="iuv-txt"><strong>Data sources:</strong> Internal PayPal data; IMF; Trade Map</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xs-12 col-sm-12 col-md-6 bottom_two">
								<div className="update_prt">2018 All Rights Reserved.</div>
							</div>
						</div>
					</div>
				</section>
			</div>
        );
    }
} 
export default Footer;
