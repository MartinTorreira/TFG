package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.User;
import java.util.List;
import java.util.stream.Collectors;

public class UserConversor {

    private UserConversor() {}

    public final static UserDto toUserDto(User user) {
        return new UserDto(user.getId(), user.getUserName(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRate(),
                user.getRole().toString(), user.getAvatar());
    }

    public final static User toUser(UserDto userDto) {

        return new User(userDto.getUserName(), userDto.getPassword(), userDto.getFirstName(), userDto.getLastName(),
                userDto.getEmail(), userDto.getRate(), userDto.getAvatar());
    }

    public final static AuthenticatedUserDto toAuthenticatedUserDto(String serviceToken, User user) {

        return new AuthenticatedUserDto(serviceToken, toUserDto(user));

    }

    public final static List<UserDto> toUserDtoList(List<User> users) {
        return users.stream().map(p -> toUserDto(p)).collect(Collectors.toList());
    }

}