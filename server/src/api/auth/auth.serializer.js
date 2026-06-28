export class AuthSerializer {
    static baseSerializer(user) {
        return {
            id: user?.id,
            email: user?.email,
            full_name: `${user?.first_name} ${user?.last_name}`,
        }
    }

    static minimalSerializer(user) {
        return {
            ...this.baseSerializer(user),
            first_name:user?.first_name,
            last_name:user?.last_name,
            created_at: user?.createdAt,
            updated_at: user?.updatedAt,
        }
    }
}