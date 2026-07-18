class Voice:
    def __init__(self, name, language, path, quality, id_int):
        self.name = name
        self.id_int = id_int
        self.language = language
        self.path = path
        self.quality = quality

    def get_path(self):
        return self.path
    def get_name(self):
        return self.name

    def get_language(self):
        return self.language

    def to_dict(self):
        return {
            "id": self.id_int,
            "name": self.name,
            "language": self.language,
            "quality": self.quality
        }