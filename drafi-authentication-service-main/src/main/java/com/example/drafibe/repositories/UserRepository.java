package com.example.drafibe.repositories;

import com.example.drafibe.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("select u " +
            "from User u " +
            "where (u.username = :username or u.email = :username) and u.status != 2 ")
    Optional<User> findUser(@Param("username") String username);

    @Query("select u " +
            "from User u " +
            "where u.email = :email and u.status != 2 ")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("select u " +
            "from User u " +
            "where u.phone = :phone and u.status != 2 ")
    Optional<User> findByPhone(@Param("phone") String phone);

}