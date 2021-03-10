package com.luv2code.ecommerce.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyAppConfig implements WebMvcConfigurer {

    @Autowired
    private Environment env;

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Override
    public void addCorsMappings(CorsRegistry cors) {

        cors.addMapping(basePath + "/**").allowedOrigins(theAllowedOrigins);
    }

//    @Bean
//    public DataSource dataSource() throws NamingException {
//        return (DataSource) new JndiTemplate()
//                .lookup(Objects.requireNonNull(env.getProperty("spring.datasource.jndi-name")));
//    }
}
