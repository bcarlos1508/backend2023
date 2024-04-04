import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import User from '../../dao/models/users.js';
import RecoveryToken from '../../dao/models/recoveryToken.js';

const server = use("chai-http")
chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await RecoveryToken.deleteMany({});
    });

    describe('/POST recover', () => {
        it('it should send a recovery email to a user', (done) => {
            const user = new User({ email: 'test@example.com', name: 'Test User' });
            user.save((err, user) => {
                if (err) {
                    done(err);
                    return;
                }
                server.request(app)
                    .post('/recover')
                    .send({ email: 'test@example.com' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('status').eql('success');
                        expect(res.body).to.have.property('message').eql('A password recovery link has been sent to your email address.');
                        done();
                    });
            });
        });

        it('it should return an error for a non-existent user email', (done) => {
            server.request(app)
                .post('/recover')
                .send({ email: 'nonexistent@example.com' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('status').eql('error');
                    expect(res.body).to.have.property('message').eql('User not found.');
                    done();
                });
        });
    });
});
