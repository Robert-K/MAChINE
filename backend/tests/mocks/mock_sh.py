class MockSH:
    def __init__(self, models=None, fittings=None):
        self.model_summaries = models
        self.fitting_summaries = fittings

        if models is None:
            self.model_summaries = {}
        if fittings is None:
            self.fitting_summaries = {}

    def get_model_summaries(self, user_id):
        return self.model_summaries

    def get_fitting_summaries(self, user_id):
        return self.fitting_summaries

    def get_model_summary(self, user_id, model_id):
        return self.model_summaries.get(model_id)

    def get_fitting_summary(self, user_id, fitting_id):
        return self.fitting_summaries.get(fitting_id)


class MockUserDelSH:

    def __init__(self, delete_handler=True):
        self.deleted = False
        self.delete_handler = delete_handler

    def get_user_handler(self, user_id):
        if self.deleted:
            return None
        return {'Handler is not None, so this counts'}

    def delete_user_handler(self, user_id):
        self.deleted = self.delete_handler
