import backend.utils.storage_handler as sh


def handler_creation_test():
    assert True == True, 'yeah'
    test_user_id = 'meesa testa'
    handler = sh.add_user_handler(test_user_id)
    assert sh.get_user_handler(test_user_id) == handler, 'Should be the same'
    sh.delete_user_handler(test_user_id)
    new_handler = sh.add_user_handler(test_user_id)
    assert sh.get_user_handler(test_user_id) != handler, 'Expected new_handler'
    assert sh.get_user_handler(test_user_id) == new_handler, 'Should be the same'

if __name__ == '__main__':
    handler_creation_test()
