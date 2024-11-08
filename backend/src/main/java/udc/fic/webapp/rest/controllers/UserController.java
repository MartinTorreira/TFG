package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import udc.fic.webapp.model.entities.ShoppingCart;
import udc.fic.webapp.model.entities.User;
import udc.fic.webapp.model.entities.UserDao;
import udc.fic.webapp.model.exceptions.*;
import udc.fic.webapp.model.services.ShoppingCartService;
import udc.fic.webapp.model.services.UserService;
import udc.fic.webapp.rest.common.ErrorsDto;
import udc.fic.webapp.rest.common.JwtGenerator;
import udc.fic.webapp.rest.common.JwtInfo;
import udc.fic.webapp.rest.dto.*;

import java.net.URI;
import java.util.List;
import java.util.Locale;

import static udc.fic.webapp.rest.dto.UserConversor.*;



@RestController
@RequestMapping("/user")
public class UserController {

    private final static String INCORRECT_LOGIN_EXCEPTION_CODE = "project.exceptions.IncorrectLoginException";
    private final static String INCORRECT_PASSWORD_EXCEPTION_CODE = "project.exceptions.IncorrectPasswordException";

    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @ExceptionHandler(IncorrectLoginException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleIncorrectLoginException(IncorrectLoginException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INCORRECT_LOGIN_EXCEPTION_CODE, null,
                INCORRECT_LOGIN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @PostMapping("/signUp")
    public ResponseEntity<AuthenticatedUserDto> signUp(
            @Validated({UserDto.AllValidations.class}) @RequestBody UserDto userDto) throws DuplicateInstanceException, DuplicateEmailException {

        User user = toUser(userDto);

        ShoppingCart shoppingCart = new ShoppingCart(user);
        user.setShoppingCart(shoppingCart);

        userService.signUp(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(location).body(toAuthenticatedUserDto(generateServiceToken(user), user));

    }

    @PostMapping("/login")
    public AuthenticatedUserDto login(@Validated @RequestBody LoginParamsDto params)
            throws IncorrectLoginException {

        User user = userService.login(params.getUserName(), params.getPassword());

        return toAuthenticatedUserDto(generateServiceToken(user), user);
    }

    @PostMapping("/loginFromServiceToken")
    public AuthenticatedUserDto loginFromServiceToken(@RequestAttribute Long userId,
                                                      @RequestAttribute String serviceToken) throws InstanceNotFoundException {

        User user = userService.loginFromId(userId);

        return toAuthenticatedUserDto(serviceToken, user);

    }

    @PostMapping("/{id}/changePassword")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@RequestAttribute Long userId, @PathVariable Long id, @Validated @RequestBody ChangePasswordParamsDto params)
        throws PermissionException, InstanceNotFoundException, IncorrectPasswordException, IncorrectOldPasswordException {

        if (!id.equals(userId)){
            throw new PermissionException("Permission exception");
        }

        //Check if the old password is correct
        if (!passwordEncoder.matches(params.getOldPassword(), userService.getUserById(id).getPassword())) {
            throw new IncorrectOldPasswordException("Old password is incorrect", userId);
        }

        userService.changePassword(id, params.getOldPassword(), params.getNewPassword());
    }


    @PutMapping("/{id}/updateProfile")
    public UserDto updateProfile(@RequestAttribute Long userId, @PathVariable Long id,
                                 @Validated({UserDto.UpdateValidations.class}) @RequestBody UserDto userDto)
            throws InstanceNotFoundException,  DuplicateInstanceException, DuplicateEmailException,PermissionException {

        if (!id.equals(userId)) {
            throw new PermissionException("Permission exception");
        }

        return toUserDto(userService.updateProfile(id, userDto.getUserName(), userDto.getFirstName(), userDto.getLastName(),
                userDto.getEmail(), userDto.getAvatar()));

    }


    @PostMapping("/{id}/changeAvatar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeAvatar(@RequestAttribute Long userId, @PathVariable Long id,
                             @Validated @RequestBody String imageUrl) throws PermissionException, InstanceNotFoundException {

        if (!id.equals(userId)) {
            throw new PermissionException("Permission exception");
        }

        userService.changeAvatar(id, imageUrl);
    }

    @GetMapping("/{id}/getUser")
    public UserDto getUser(@PathVariable Long id) throws InstanceNotFoundException {
        return toUserDto(userService.getUserById(id));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<UserDto> rateUser(@RequestAttribute Long userId, @PathVariable Long id, @RequestParam int rate) throws InstanceNotFoundException {
        User user = userDao.findById(id).orElseThrow(() -> new InstanceNotFoundException("User", id));
        if (user.getId().equals(userId)) {
            throw new IllegalArgumentException("A user cannot rate himself");
        }
        userService.rateUser(id, rate);
        return ResponseEntity.ok(UserConversor.toUserDto(user));
    }

//    @GetMapping("/{id}/averageRating")
//    public ResponseEntity<Double> getUserAverageRating(@PathVariable Long id) throws InstanceNotFoundException {
//        double averageRating = userService.getAverageRating(id);
//        return ResponseEntity.ok(averageRating);
//    }



    // Auxiliar functions #############################################################################################

    private String generateServiceToken(User user) {

        JwtInfo jwtInfo = new JwtInfo(user.getId(), user.getUserName(), user.getRole().toString());

        return jwtGenerator.generate(jwtInfo);

    }

    @GetMapping("/getUsers")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<UserDto>> getUsers() {
        List<User> users = userService.findAll();
        List<UserDto> userDtos = toUserDtoList(users);
        return ResponseEntity.ok().body(userDtos);
    }



}
