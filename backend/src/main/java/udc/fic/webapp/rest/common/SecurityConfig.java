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
import java.util.Arrays;
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
				.antMatchers(HttpMethod.POST, "/user/signUp").permitAll()
				.antMatchers(HttpMethod.POST, "/user/login").permitAll()
				.antMatchers(HttpMethod.POST, "/user/loginFromServiceToken").permitAll()
				.antMatchers(HttpMethod.GET, "/user/getUsers").permitAll()
				.antMatchers(HttpMethod.POST, "/user/*/changePassword").authenticated()
				.antMatchers(HttpMethod.PUT, "/user/*/updateProfile").authenticated()
				.antMatchers(HttpMethod.POST, "/user/*/changeAvatar").authenticated()
				.antMatchers(HttpMethod.POST, "/product/add").authenticated()


				// .antMatchers(HttpMethod.POST, "/users/*/changePassword").hasAnyRole("VIEWER", "TICKET_SELLER")
				// .antMatchers(HttpMethod.GET, "/catalog/billboard").permitAll()
				// .antMatchers(HttpMethod.GET, "/catalog/movies/*").permitAll()
				// .antMatchers(HttpMethod.GET, "/catalog/sessions/*").permitAll()
				// .antMatchers(HttpMethod.GET, "/buying/orders").hasRole("VIEWER")
				// .antMatchers(HttpMethod.POST, "/buying/buy/*").hasRole("VIEWER")
				// .antMatchers(HttpMethod.POST, "/buying/deliver").hasRole("TICKET_SELLER")
				.anyRequest().denyAll();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration config = new CorsConfiguration();
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		config.setAllowCredentials(true);
		//config.setAllowedOriginPatterns(Arrays.asList("*"));
		config.addAllowedOrigin("http://localhost:8080");
		config.addAllowedOrigin("http://localhost:3000");
		config.addAllowedOrigin("http://192.168.1.36:3000");
		config.addAllowedOrigin("https://660d2bd96ddfa2943b33731c.mockapi.io"); // Permitir el dominio de mockapi
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");

		source.registerCorsConfiguration("/**", config);


		return source;

	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}


}
