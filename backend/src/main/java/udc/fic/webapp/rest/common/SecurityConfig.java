package udc.fic.webapp.rest.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtGenerator jwtGenerator;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
				.addFilter(new JwtFilter(authenticationManager(), jwtGenerator))
				.authorizeRequests()
				.antMatchers(HttpMethod.GET, "/user/getUsers").permitAll()
				.antMatchers(HttpMethod.GET, "/user/*/getUser").permitAll()
				.antMatchers(HttpMethod.GET, "/user/*/getNotifications").authenticated()
				.antMatchers(HttpMethod.GET, "/product/allCategories").permitAll()
				.antMatchers(HttpMethod.GET, "/product/").permitAll()
				.antMatchers(HttpMethod.GET, "/product/*/details").permitAll()
				.antMatchers(HttpMethod.GET, "/product/favorites").authenticated()
				.antMatchers(HttpMethod.GET, "/product/*/productList*").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/success").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/*").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/*/getUserPurchases").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/*/getProducts").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/*/getPurchase").permitAll()
				.antMatchers(HttpMethod.GET, "/purchase/*/getUserSales").permitAll()
				.antMatchers(HttpMethod.GET, "/shoppingCart/*/getItems").authenticated()
				.antMatchers(HttpMethod.GET, "/shoppingCart/getProducts").authenticated()
				.antMatchers(HttpMethod.GET, "/shoppingCart/*/getItemId").authenticated()
				.antMatchers(HttpMethod.GET, "/shoppingCart/*/getProduct").authenticated()
				.antMatchers(HttpMethod.GET, "/chat/messages").permitAll()
				.antMatchers(HttpMethod.GET, "/chat/user").permitAll()
				.antMatchers(HttpMethod.GET, "/offer/*/get").authenticated()
				.antMatchers(HttpMethod.GET, "/offer/buyer/*").authenticated()
				.antMatchers(HttpMethod.GET, "/offer/seller/*").authenticated()


				.antMatchers(HttpMethod.POST, "/user/signUp").permitAll()
				.antMatchers(HttpMethod.POST, "/user/login").permitAll()
				.antMatchers(HttpMethod.POST, "/user/loginFromServiceToken").permitAll()
				.antMatchers(HttpMethod.POST, "/user/*/changePassword").authenticated()
				.antMatchers(HttpMethod.POST, "/user/*/changeAvatar").authenticated()
				.antMatchers(HttpMethod.POST, "/product/add").authenticated()
				.antMatchers(HttpMethod.POST, "/product/*/addFavorite").authenticated()
				.antMatchers(HttpMethod.POST, "/purchase/create").permitAll()
				.antMatchers(HttpMethod.POST, "/purchase/execute").permitAll()
				.antMatchers(HttpMethod.POST, "/purchase/refund").authenticated()
				.antMatchers(HttpMethod.POST, "/payment/create").authenticated()
				.antMatchers(HttpMethod.POST, "/shoppingCart/addProduct").authenticated()
				.antMatchers(HttpMethod.POST, "/sendMessage").authenticated()
				.antMatchers(HttpMethod.POST, "/offer/create").authenticated()


				.antMatchers(HttpMethod.PUT, "/user/*/updateProfile").authenticated()
				.antMatchers(HttpMethod.PUT, "/product/*/update").authenticated()
				.antMatchers(HttpMethod.PUT, "/product/*/changeImages").authenticated()
				.antMatchers(HttpMethod.PUT, "/purchase/*/changeRefundStatus").authenticated()
				.antMatchers(HttpMethod.PUT, "/purchase/*/changePurchaseStatus").authenticated()
				.antMatchers(HttpMethod.PUT, "/shoppingCart/updateQuantity").authenticated()
				.antMatchers(HttpMethod.PUT, "/notifications/{notificationId}/markAsRead").authenticated()
				

				.antMatchers(HttpMethod.DELETE, "/product/*/delete").authenticated()
				.antMatchers(HttpMethod.DELETE, "/product/*/removeFavorite").authenticated()
				.antMatchers(HttpMethod.DELETE, "/shoppingCart/*/removeFavorite").authenticated()
				.antMatchers(HttpMethod.DELETE, "/shoppingCart/*/removeItem").authenticated()
				.antMatchers(HttpMethod.DELETE, "/purchase/*/removePurchase").authenticated()
				.antMatchers(HttpMethod.DELETE, "/purchase/*/delete").authenticated()


				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.antMatchers("/chat/**").permitAll()
				.antMatchers("/ws/**").permitAll()
				.antMatchers("/app/**").permitAll()
				.anyRequest().authenticated();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:3000");
		config.addAllowedOrigin("http://192.168.1.36:3000");
		config.addAllowedOrigin("https://660d2bd96ddfa2943b33731c.mockapi.io");
		config.addAllowedOrigin("https://www.sandbox.paypal.com");
		config.addAllowedOrigin("https://www.paypal.com");
		config.addAllowedOrigin("https://api.sandbox.paypal.com");
		config.addAllowedOrigin("https://sandbox.paypal.com/sdk/js?client-id=AfAuDL8Y-RaJ90kX1mAJfQy2mGGefCc1ovLwoVE74NKZCEmie7xnfiwP6om2MnAwAm0YhB6_zTfJSfWa");
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	//@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	//@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}