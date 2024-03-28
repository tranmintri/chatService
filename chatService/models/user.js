class User {
    constructor(id,username,display_name,phone,email,profilePicture,updated_at,created_at,friends) {
        this.id = id;
        this.username = username;
        this.display_name = display_name;
        this.updated_at = updated_at;
        this.created_at = created_at;
        this.profilePicture = profilePicture;
        this.email = email,
        this.friends = friends,
            this.phone = phone
    }
}
module.exports = {User}

