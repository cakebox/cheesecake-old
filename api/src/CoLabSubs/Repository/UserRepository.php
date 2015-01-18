<?php

namespace CoLabSubs\Repository;

use Doctrine\DBAL\Connection;
use CoLabSubs\Entity\User;

/**
 * User repository
 */
class UserRepository implements RepositoryInterface
{
    /**
     * @var \Doctrine\DBAL\Connection
     */
    protected $db;

    public function __construct(Connection $db)
    {
        $this->db = $db;
    }

    /**
     * Saves the user to the database.
     *
     * @param \CoLabSubs\Entity\User $user
     */
    public function save($user)
    {
        $userData = array(
            'name'          => $user->getName(),
            'username'      => $user->getUsername(),
            'password'      => $user->getPassword(),
            'mail'          => $user->getMail(),
            'birth_date'    => $user->getBirthDate()->format('Y-m-d G:i:s'),
            'gender'        => $user->getGender(),
            'last_seen'     => $user->getLastSeen()->format('Y-m-d G:i:s'),
            'last_ip'       => $user->getLastIP(),
            'failed_logins' => $user->getFailedLogins()
        );

        if ($user->getId()) {
            $this->db->update('users', $userData, array('id' => $user->getId()));
        } else {
            $this->db->insert('users', $userData);

            $id = $this->db->lastInsertId();
            $user->setId($id);
        }
    }

    /**
     * Returns a user matching the supplied id.
     *
     * @param integer $id
     *
     * @return \CoLabSubs\Entity\User|false An entity object if found, false otherwise.
     */
    public function find($id)
    {
        $userData = $this->db->fetchAssoc('SELECT * FROM users WHERE id = ?', array($id));
        return $userData ? $this->buildUser($userData) : FALSE;
    }

    /**
     * Returns a user matching the supplied username.
     *
     * @param string $username
     *
     * @return \CoLabSubs\Entity\User|false An entity object if found, false otherwise.
     */
    public function find($id)
    {
        $userData = $this->db->fetchAssoc('SELECT * FROM users WHERE username = ?', array($username));
        return $userData ? $this->buildUser($userData) : FALSE;
    }

    /**
     * Returns a collection of users.
     *
     * @param integer $limit
     *   The number of users to return.
     * @param integer $offset
     *   The number of users to skip.
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of users, keyed by user id.
     */
    public function findAll($limit, $offset = 0, $orderBy = array())
    {
        // Provide a default orderBy.
        if (!$orderBy) {
            $orderBy = array('username' => 'ASC');
        }

        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('u.*')
            ->from('users', 'u')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->orderBy('u.' . key($orderBy), current($orderBy));
        $statement = $queryBuilder->execute();
        $usersData = $statement->fetchAll();

        $users = array();
        foreach ($usersData as $userData) {
            $userId = $userData['user_id'];
            $users[$userId] = $this->buildUser($userData);
        }

        return $users;
    }

    public function delete($id)
    {
    }

    public function getCount()
    {
    }

    /**
     * Instantiates a user entity and sets its properties using db data.
     *
     * @param array $userData
     *   The array of db data.
     *
     * @return \CoLabSubs\Entity\User
     */
    protected function buildUser($userData)
    {
        $user = new User();
        $user->setId($userData['id']);
        $user->setUsername($userData['username']);
        $user->setPassword($userData['password']);
        $user->setMail($userData['mail']);
        $user->setBirthDate(new \DateTime(date('Y-m-d H:i:s', strtotime($userData['birth_date']))));
        $user->setGender($userData['gender']);
        $user->setLastSeen(new \DateTime(date('Y-m-d H:i:s', strtotime($userData['last_seen']))));
        $user->setLastIP($userData['last_ip']);
        $user->setSubscriptionDate(new \DateTime(date('Y-m-d H:i:s', strtotime($userData['subscription_date']))));
        $user->setFailedLogins($userData['failed_logins']);
        //$user->setAccess($userData['access']);

        return $user;
    }
}
