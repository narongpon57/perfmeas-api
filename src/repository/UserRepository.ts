import { EntityRepository, Repository, getConnection, createQueryBuilder, getRepository } from "typeorm";
import { Users } from "../entity/Users";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
	async authentication(username: string, password: string) {
		return await getRepository(Users)
			.createQueryBuilder('users')
			.select('users.id, users.username, users.first_name, users.last_name, users.employee_code, users.is_admin, users.email')
			.where('users.username = :username and users.password = :password', {
				username: username,
				password: password
			})
			.getOne()
	}

	async findByCondition(code: string, name: string) {
		return await getConnection()
			.createQueryBuilder()
			.select('users')
			.from(Users, 'users')
			.where(`employee_code like :code and (first_name || ' ' || last_name) like :name`, {
				code: `%${code}%`,
				name: `%${name}%`
			})
			.orderBy('id', 'ASC')
			.getMany()
	}

	async findAll() {
		return await getConnection()
			.createQueryBuilder()
			.select('users')
			.from(Users, 'users')
			.orderBy('id', 'DESC')
			.getMany()
	}
}